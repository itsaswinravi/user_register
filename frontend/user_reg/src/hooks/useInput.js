import useLocalStorage from "./useLocalStorage";
const useInput = (key,initValue) => {
    const [value, setValue] = useLocalStorage(key,initValue);

    const reset = () => setValue(initValue);

    const attributeObj = {
        value ,
        onchange: (e) => setValue(e.target.value)
    }
    return [value, reset, attributeObj];
    
}
export default useInput