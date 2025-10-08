import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

interface Option {
  id: string;
  label: string;
}

interface SearchableDropdownProps {
  name: string;
  value: string;
  placeholder?: string;
  options: Option[];
  onChange: (value: string) => void;
  showIcon?: boolean;
  maxOptions?: number;
}

export default function SearchableDropdown({
  name,
  value,
  placeholder = "Search...",
  options,
  onChange,
  showIcon = true,
  maxOptions,
}: SearchableDropdownProps) {
  const [query, setQuery] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdown when clicking outside (safe version)
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  const filteredOptions = options
    .filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxOptions);

  return (
    <div ref={dropdownRef} className="w-full relative">
      <div className="relative">
        {showIcon && (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full rounded-md text-sm border border-[var(--border-gray)] shadow-sm bg-background ${
            showIcon ? "pl-10" : "pl-3"
          } pr-3 py-2 outline-none focus:ring-1 focus:ring-gray-400`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-[var(--border-gray)] bg-white shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className="px-3 py-2 cursor-pointer text-sm hover:bg-gray-100"
                onClick={() => {
                  onChange(option.label);
                  setQuery(option.label);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No results</div>
          )}
        </div>
      )}
    </div>
  );
}
