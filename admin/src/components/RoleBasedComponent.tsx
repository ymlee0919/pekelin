import { useAuth } from "../hooks/useAuth";
import { CommonProps } from "../types/Common";

interface RoleBasedComponentProps extends CommonProps {
    roles: string[]
}

const RoleBasedComponent = (props: RoleBasedComponentProps) => {
  
    const { permissions } = useAuth();

    if (permissions.length == 0) {
        return null; 
    }

    const hasPermission = props.roles.some((role) => permissions.includes(role));

    return hasPermission ? props.children : null;
};

export default RoleBasedComponent;