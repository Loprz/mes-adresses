import BaseLocale from "@/components/help/help-tabs/base-locale";
import Voies from "@/components/help/help-tabs/voies";
import Toponymes from "@/components/help/help-tabs/toponymes";
import Numeros from "@/components/help/help-tabs/numeros";
import Publication from "@/components/help/help-tabs/publication";

// Translation keys (resolved against the "helpCommon" namespace in the Help UI)
export const TABS = [
  "tabLocalBase",
  "tabStreets",
  "tabPlaceNames",
  "tabNumbers",
  "tabPublication",
];

interface HelpTabsProps {
  tab: number;
}

function HelpTabs({ tab }: HelpTabsProps) {
  switch (tab) {
    case 0:
      return <BaseLocale />;
    case 1:
      return <Voies />;
    case 2:
      return <Toponymes />;
    case 3:
      return <Numeros />;
    case 4:
      return <Publication />;
    default:
      return <BaseLocale />;
  }
}

export default HelpTabs;
