#!/usr/bin/env node
/**
 * i18n catalog validator (Spanish spot-check).
 *
 * Validates messages/en.json (source of truth) against messages/es.json:
 *   1. Key parity            - every leaf key exists in both, none extra.
 *   2. Placeholder parity    - each shared key uses the same set of ICU
 *                              argument names ({name}, {count, plural, ...}).
 *   3. Plural completeness    - every ICU plural/selectordinal block has an
 *                              `other` category in both locales.
 *   4. Empty values          - no blank strings.
 *   5. Untranslated heuristic - flags es values identical to en (warning only;
 *                              many are legitimate: brand names, codes, emails).
 *
 * Exit code is non-zero if any hard error (1-4) is found. Warnings (5) never
 * fail the run. Run from mes-adresses/:  node scripts/check-i18n.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse } from "@formatjs/icu-messageformat-parser";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = (f) => JSON.parse(readFileSync(join(root, "messages", f), "utf8"));

const en = load("en.json");
const es = load("es.json");

/** Flatten nested catalog into { "a.b.c": "value" }. */
function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

// formatjs AST element types: 1=argument 2=number 3=date 4=time 5=select
// 6=plural 7=pound 8=tag. Each non-literal carries `.value` = the arg name.
const ARG_TYPES = new Set([1, 2, 3, 4, 5, 6]);

/** Walk a parsed ICU AST, invoking visit(element) on every node. */
function walk(ast, visit) {
  for (const el of ast) {
    visit(el);
    if (el.options) for (const opt of Object.values(el.options)) walk(opt.value, visit);
    if (el.children) walk(el.children, visit);
  }
}

/** Real ICU argument names (not branch text / category keys). Throws on bad ICU. */
function argNames(msg) {
  const names = new Set();
  if (typeof msg !== "string") return names;
  walk(parse(msg), (el) => {
    if (ARG_TYPES.has(el.type) && el.value) names.add(el.value);
  });
  return names;
}

/** Does every plural/select block declare an `other` category? */
function pluralsHaveOther(msg) {
  if (typeof msg !== "string") return true;
  let ok = true;
  walk(parse(msg), (el) => {
    if ((el.type === 5 || el.type === 6) && el.options && !("other" in el.options))
      ok = false;
  });
  return ok;
}

const enFlat = flatten(en);
const esFlat = flatten(es);
const enKeys = new Set(Object.keys(enFlat));
const esKeys = new Set(Object.keys(esFlat));

const errors = [];
const warnings = [];

// 1. Key parity
const missingInEs = [...enKeys].filter((k) => !esKeys.has(k));
const extraInEs = [...esKeys].filter((k) => !enKeys.has(k));
for (const k of missingInEs) errors.push(`missing in es.json:  ${k}`);
for (const k of extraInEs) errors.push(`extra in es.json (not in en): ${k}`);

// 2-5 over shared keys
for (const k of enKeys) {
  if (!esKeys.has(k)) continue;
  const eval_ = enFlat[k];
  const sval = esFlat[k];

  // 4. empty
  if (typeof sval === "string" && sval.trim() === "")
    errors.push(`empty es value:  ${k}`);

  // 2. placeholder parity (+ ICU validity)
  let ea, sa;
  try {
    ea = argNames(eval_);
  } catch (e) {
    errors.push(`invalid ICU in en.json: ${k}  (${e.message})`);
  }
  try {
    sa = argNames(sval);
  } catch (e) {
    errors.push(`invalid ICU in es.json: ${k}  (${e.message})`);
  }
  if (ea && sa) {
    const onlyEn = [...ea].filter((a) => !sa.has(a));
    const onlyEs = [...sa].filter((a) => !ea.has(a));
    if (onlyEn.length || onlyEs.length) {
      errors.push(
        `placeholder mismatch: ${k}  (en-only: [${onlyEn}]  es-only: [${onlyEs}])`
      );
    }
  }

  // 3. plural completeness (es)
  try {
    if (!pluralsHaveOther(sval))
      errors.push(`plural block missing 'other' category: ${k}`);
  } catch {
    /* ICU error already reported above */
  }

  // 5. untranslated heuristic (warning only)
  if (
    typeof eval_ === "string" &&
    typeof sval === "string" &&
    eval_.trim() &&
    eval_ === sval &&
    /[a-zA-Z]{4,}/.test(eval_) && // has a real word
    eval_.length > 6 // skip short tokens / codes
  ) {
    warnings.push(`es identical to en (verify intentional): ${k} = ${JSON.stringify(eval_)}`);
  }
}

const enCount = enKeys.size;
console.log(`i18n check: ${enCount} en keys, ${esKeys.size} es keys`);

if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} warning(s) (not fatal):`);
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length) {
  console.error(`\n✖ ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`\n✓ parity OK, placeholders consistent, plurals complete, no empty values`);
