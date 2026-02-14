import { Dispatch, SetStateAction, useState } from "react";
import { Autocomplete, Position, SearchInput } from "evergreen-ui";
import { useDebouncedCallback } from "use-debounce";
import { ApiGeoService } from "@/lib/geo-api";
import { CommuneType } from "@/types/commune";

export interface CommuneSearchProps {
  placeholder: string;
  innerRef: Dispatch<any>;
  initialSelectedItem?: CommuneType;
  onSelect: Dispatch<SetStateAction<CommuneType>>;
  [x: string]: any;
}

function CommuneSearch({
  placeholder = "Search for a jurisdiction…",
  innerRef = () => {},
  initialSelectedItem = null,
  onSelect = () => {},
  ...props
}: CommuneSearchProps) {
  const [communes, setCommunes] = useState([]);

  const onSearch = useDebouncedCallback(async (value) => {
    const results = await ApiGeoService.searchCommunes(value, {
      fields: "departement",
      limit: 20,
    });
    const list = Array.isArray(results) ? results : [];
    const bestResults = list.filter((c) => c && c._score > 0.1);

    setCommunes(bestResults.length > 5 ? bestResults : list);
  }, 300);

  const initRef = (ref, getRef) => {
    if (innerRef) {
      innerRef(ref);
    }
    getRef(ref);
  };

  return (
    <Autocomplete
      isFilterDisabled
      initialSelectedItem={initialSelectedItem}
      items={communes}
      itemToString={(item) =>
        item
          ? `${item.nom}${
              item.departement
                ? `, ${item.departement.code}`
                : ""
            }${
              item.level === 'county'
                ? ' (county)'
                : item.countyName
                  ? ` — ${item.countyName}`
                  : ''
            }`
          : ""
      }
      onChange={onSelect}
      position={Position.BOTTOM_LEFT}
    >
      {({ getInputProps, getRef, inputValue }) => {
        return (
          <SearchInput
            ref={(ref) => initRef(ref, getRef)}
            autoComplete="chrome-off"
            placeholder={placeholder}
            value={inputValue}
            {...getInputProps({
              onChange: (e) => onSearch(e.target.value),
            })}
            {...props}
          />
        );
      }}
    </Autocomplete>
  );
}

export default CommuneSearch;
