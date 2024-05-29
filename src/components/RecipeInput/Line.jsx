import { recipeInputHrClassNames } from './constants'

/**
 * Renders a horizontal line element with specified class names.
 *
 * @returns {JSX.Element} A horizontal line element with the specified class names.
 */
const Line = () => <hr className={recipeInputHrClassNames.join(' ')} />

export default Line
