import { forwardRef, useState } from 'react';
import { Checkbox } from 'semantic-ui-react';

export const TestItem = forwardRef(({ playlist}, ref ) => {
    const [checked, setChecked] = useState(true);

    return (
        <Checkbox toggle ref={ref} checked={ checked } onChange={console.log(playlist)} />
    )
});

export default TestItem