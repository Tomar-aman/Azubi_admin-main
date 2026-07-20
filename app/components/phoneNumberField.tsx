"use client";

import React from "react";
import { MenuItem, Select, Stack, TextField } from "@mui/material";

/**
 * Country dial codes shown in the dropdown. Germany (+49) is the default
 * since this is a German platform. Any code stored on an existing record that
 * isn't in this list is added on the fly so the dropdown never shows blank.
 */
export const COUNTRY_CODES = [
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+43", label: "🇦🇹 +43" },
  { code: "+41", label: "🇨🇭 +41" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+39", label: "🇮🇹 +39" },
  { code: "+34", label: "🇪🇸 +34" },
  { code: "+31", label: "🇳🇱 +31" },
  { code: "+48", label: "🇵🇱 +48" },
  { code: "+90", label: "🇹🇷 +90" },
  { code: "+971", label: "🇦🇪 +971" },
];

const DEFAULT_CODE = "+49";

/**
 * Split a stored phone string ("+49 123-45") into a dial code and the number.
 * Prefers a known dial-code prefix (longest first) so numbers saved without a
 * space (e.g. legacy "+4915212345") still split correctly.
 */
const parsePhone = (value?: string): { code: string; number: string } => {
  const v = (value || "").trim();
  if (!v) return { code: DEFAULT_CODE, number: "" };

  const known = [...COUNTRY_CODES].sort(
    (a, b) => b.code.length - a.code.length
  );
  for (const c of known) {
    if (v.startsWith(c.code)) {
      return { code: c.code, number: v.slice(c.code.length).trim() };
    }
  }

  const match = v.match(/^(\+\d{1,4})\s*(.*)$/);
  if (match) return { code: match[1], number: match[2] };

  return { code: DEFAULT_CODE, number: v };
};

interface Props {
  /** Combined stored value, e.g. "+49 123-45". */
  value?: string;
  /** Emits the combined value (or "" when the number is empty). */
  onChange: (value: string) => void;
  onBlur?: (e: any) => void;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
}

/**
 * Country-code dropdown + free-text phone number. The number stays plain text
 * so special characters (| \ - etc.) are allowed. The two parts are combined
 * into a single string ("<code> <number>") so no backend/DB change is needed.
 */
const PhoneNumberField: React.FC<Props> = ({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  placeholder,
  error,
  helperText,
}) => {
  const parsed = parsePhone(value);
  // Keep the selected code locally so it persists while the number is empty.
  const [code, setCode] = React.useState(parsed.code);
  const number = parsed.number;

  // Sync the dropdown when an external value with an explicit code arrives
  // (e.g. loading a record for edit).
  React.useEffect(() => {
    if (value) {
      setCode(parsePhone(value).code);
    }
  }, [value]);

  const options = COUNTRY_CODES.some((c) => c.code === code)
    ? COUNTRY_CODES
    : [{ code, label: code }, ...COUNTRY_CODES];

  const emit = (nextCode: string, nextNumber: string) => {
    const trimmed = (nextNumber || "").trim();
    onChange(trimmed ? `${nextCode} ${trimmed}` : "");
  };

  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Select
        value={code}
        disabled={disabled}
        size="small"
        onChange={(e) => {
          const nextCode = e.target.value as string;
          setCode(nextCode);
          emit(nextCode, number);
        }}
        sx={{ minWidth: 110, flexShrink: 0 }}
      >
        {options.map((c) => (
          <MenuItem key={c.code} value={c.code}>
            {c.label}
          </MenuItem>
        ))}
      </Select>
      <TextField
        type="text"
        fullWidth
        name={name}
        disabled={disabled}
        placeholder={placeholder || "Enter phone number"}
        value={number}
        onChange={(e) => emit(code, e.target.value)}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
      />
    </Stack>
  );
};

export default PhoneNumberField;
