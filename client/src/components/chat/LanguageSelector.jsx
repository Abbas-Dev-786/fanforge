import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "ja", name: "日本語" },
];

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}) {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="language-select-label">Language</InputLabel>
      <Select
        labelId="language-select-label"
        value={selectedLanguage}
        label="Language"
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
