import React from 'react';

const FilterContext = React.createContext(null);

export const withFilter = Component => props => (
    <FilterContext.Consumer>
        {filter => <Component {...props} filter={filter} />}
    </FilterContext.Consumer>
);

export default FilterContext;