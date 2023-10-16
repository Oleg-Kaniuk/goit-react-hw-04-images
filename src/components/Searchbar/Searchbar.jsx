import { SearchbarContainer, SearchForm, SearchFormButton, SearchFormInput } from "./Searchbar.styled";
import { HiOutlineSearch } from 'react-icons/hi';

export const Searchbar = ({ onSubmitSearch }) => (
  <SearchbarContainer>
    <SearchForm onSubmit={onSubmitSearch}>
      <SearchFormButton>
        <HiOutlineSearch size="30" />
      </SearchFormButton>

      <SearchFormInput
        type="text"
        name="search"
        autoComplete="off"
        autoFocus
        placeholder="Search images and photos"
      />
    </SearchForm>
  </SearchbarContainer>
);
