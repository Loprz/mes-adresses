import { IconButton, AddIcon, CrossIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface AddressEditorControlProps {
  isAddressFormOpen?: boolean;
  isDisabled?: boolean;
  handleAddressForm: (isAddressFormOpen: boolean) => void;
}

function AddressEditorControl({
  isAddressFormOpen,
  isDisabled,
  handleAddressForm,
}: AddressEditorControlProps) {
  const t = useTranslations("mapControls");
  return (
    <>
      {isAddressFormOpen ? (
        <IconButton
          height={29}
          width={29}
          icon={CrossIcon}
          onClick={() => handleAddressForm(false)}
          title={t("cancelAddressCreation")}
        />
      ) : (
        <IconButton
          height={29}
          width={29}
          icon={AddIcon}
          disabled={isDisabled}
          intent="success"
          appearance="primary"
          onClick={() => handleAddressForm(true)}
          title={t("createAddress")}
        />
      )}
    </>
  );
}

export default AddressEditorControl;
