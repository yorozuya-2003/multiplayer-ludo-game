import { AuthContext } from "@/components/Contexts";
import { useContext } from "react";

const useAuthContext = () => {
    const context = useContext(AuthContext);
    
    return context;
}
 
export default useAuthContext;