/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import {
  TextField,
  CircularProgress,
  Autocomplete,
  type AutocompleteRenderInputParams,
} from "@mui/material";

export interface PaginatedSelectProps<T, M> {
  label: string;
  value: T | T[] | null;
  multiple?: boolean;
  disabled?: boolean;
  per_page?: number;
  onChange: (value: T | T[] | null) => void;
  fetchOptions: (page: number, per_page: number, search: string) => Promise<M[]>;
  getOptionLabel: (option: M) => string;
  getOptionValue: (option: M) => T;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  debounceTime?: number;
  initialOptions?: M[];
}

export default function PaginatedSelect<T, M>({
  label,
  value,
  multiple = false,
  disabled = false,
  per_page = 10,
  onChange,
  fetchOptions,
  getOptionLabel,
  getOptionValue,
  error = false,
  helperText,
  placeholder = "",
  debounceTime = 300,
  initialOptions = [],
}: PaginatedSelectProps<T, M>) {
  const [options, setOptions] = useState<M[]>(initialOptions);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [initialLoad, setInitialLoad] = useState(!initialOptions.length);

  /** Load options from API **/
  const loadOptions = async (pageNum: number, searchTerm: string, isInitial = false) => {
    setLoading(true);
    try {
      const data = await fetchOptions(pageNum, per_page, searchTerm);
      const list = Array.isArray(data) ? data : [];
      setHasMore(list.length >= per_page);

      setOptions((prev) => {
        if (pageNum === 1) return list;
        const existingIds = new Set(prev.map(getOptionValue));
        const newItems = list.filter((item) => !existingIds.has(getOptionValue(item)));
        return [...prev, ...newItems];
      });

      if (isInitial) setInitialLoad(false);
    } catch (err) {
      console.error("Fetch options failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoad && !search) {
      loadOptions(1, "", true);
    }
  }, [initialLoad]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      loadOptions(1, search);
    }, debounceTime);
    return () => clearTimeout(delay);
  }, [search, per_page]);

  useEffect(() => {
    if (page > 1) loadOptions(page, search);
  }, [page]);

  const handleScroll = (event: React.SyntheticEvent) => {
    const listbox = event.currentTarget;
    const bottom = listbox.scrollHeight - listbox.scrollTop - listbox.clientHeight;
    if (bottom < 100 && hasMore && !loading) setPage((prev) => prev + 1);
  };

  const selectedOptions = useMemo(() => {
    if (!value || (Array.isArray(value) && !value.length)) {
      return multiple ? [] : null;
    }

    if (multiple) {
      const valueArray = value as T[];
      return options.filter((opt) =>
        valueArray.includes(getOptionValue(opt))
      );
    }

    const singleValue = value as T;
    const found = options.find((opt) => getOptionValue(opt) === singleValue);
    return found || null;
  }, [options, value, multiple, getOptionValue]);

  /** Handle selection change **/
  const handleChange = (_: unknown, newValue: M | M[] | null) => {
    if (multiple) {
      const valuesArray = Array.isArray(newValue)
        ? newValue.map(getOptionValue)
        : [];
      onChange(valuesArray as T[]);
    } else {
      const singleValue = newValue ? getOptionValue(newValue as M) : null;
      onChange(singleValue);
    }
  };

  /** Render input **/
  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      label={label}
      placeholder={placeholder}
      variant="outlined"
      size="small"
      error={error}
      helperText={helperText}
      slotProps={{
        input: {
          ...params.InputProps,
          endAdornment: (
            <>
              {loading && <CircularProgress size={16} sx={{ mr: 1 }} />}
              {params.InputProps.endAdornment}
            </>
          ),
        }
      }}
    />
  );

  return (
    <Autocomplete
      multiple={multiple}
      size="small"
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, val) =>
        getOptionValue(option) === getOptionValue(val)
      }
      value={selectedOptions}
      onChange={handleChange}
      onInputChange={(_, newInputValue) => setSearch(newInputValue)}
      loading={loading}
      disabled={disabled}
      renderInput={renderInput}
      slotProps={{
        listbox: {
          onScroll: handleScroll,
          style: { maxHeight: 250, overflow: "auto" },
        },
      }}
      renderOption={(props, option) => (
        <li {...props}>{getOptionLabel(option)}</li>
      )}
    />
  );
}
