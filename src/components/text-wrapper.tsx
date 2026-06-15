"use client";

import { useState } from "react";
import { Text, Strong, Icon, CaretUpIcon, CaretDownIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface TextWrapperProps {
  placeholder?: string;
  isOpenDefault?: boolean;
  children: React.ReactNode;
}

function TextWrapper({
  placeholder,
  isOpenDefault = false,
  children,
}: TextWrapperProps) {
  const tc = useTranslations("common");
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const label = placeholder ?? tc("learnMore");
  return (
    <>
      <Text
        display="flex"
        alignItems="center"
        textDecoration="underline"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Strong fontSize={12}>{label}</Strong>
        <Icon icon={isOpen ? CaretUpIcon : CaretDownIcon} />
      </Text>

      {isOpen && children}
    </>
  );
}

export default TextWrapper;
