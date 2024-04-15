"use client";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface LinkProps {
  children: React.ReactNode;
  href: string;
}

export function PageLink({ children, href }: LinkProps) {
  return (
    <Link href={href} color="blue.400" _hover={{ color: "blue.500" }}>
      {children}
    </Link>
  );
}

export function ExtenalLink({ children, href }: LinkProps) {
  return (
    <Link
      href={href}
      color="blue.400"
      _hover={{ color: "blue.500" }}
      isExternal
    >
      {children}
      {<ExternalLinkIcon mx="2px" />}
    </Link>
  );
}
