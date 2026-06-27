import { Pane, Badge } from "evergreen-ui";

interface BadgeSelectProps {
  options: readonly string[];
  onChange: (value: string) => void;
  value: string;
  // Optional renderer to display a human-readable label for an option while
  // keeping the option's stable value for state/comparison. Defaults to the
  // value itself.
  getLabel?: (value: string) => string;
}

export function BadgeSelect({
  options,
  onChange,
  value,
  getLabel,
}: BadgeSelectProps) {
  return (
    <Pane display="flex" flexWrap="wrap">
      {options.map((option) => (
        <Badge
          key={option}
          marginRight={8}
          marginBottom={8}
          onClick={() => onChange(option)}
          isInteractive
          color={value === option ? "blue" : "neutral"}
          userSelect="none"
        >
          {getLabel ? getLabel(option) : option}
        </Badge>
      ))}
    </Pane>
  );
}
