import { IconButton, AddIcon, CrossIcon } from "evergreen-ui";

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
  return (
    <>
      {isAddressFormOpen ? (
        <IconButton
          height={29}
          width={29}
          icon={CrossIcon}
          onClick={() => handleAddressForm(false)}
          title="Cancel address creation'une adresse"
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
          title="Create an address"
        />
      )}
    </>
  );
}

export default AddressEditorControl;
