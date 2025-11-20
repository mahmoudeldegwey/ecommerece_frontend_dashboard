import { useState,useEffect } from 'react'
import { Modal, Button, TextInput, Label,Select } from "flowbite-react";
import {useTranslations} from 'next-intl';
import  { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import { RoleSchema} from "@/utils/validationSchema";
import {editRole,roleSingle} from '@/utils/actions/roles/actions'
import {permissionsList} from '@/utils/actions/permissions/action'

interface Role {
    id: number;
    name: string;
    permissions: number[];
}

interface EditModal {
    isOpen: boolean;
    onClose: () => void;
    refreshRolesList:() => void;
    roleData: Role
}

const EditModal: React.FC<EditModal> = ({ isOpen, onClose, refreshRolesList, roleData }) => {
    const [newRole, setNewRole] = useState<Role>({id: 0, name: "", permissions: []});
    
    const [permissions, setPermissions] = useState<{ id: number; name: string }[]>([]);

    const { data: session } = useSession();
    
    const t = useTranslations('RolesPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    const getPermissions = async () => {
        
        permissionsList(session?.user?.token).then( result => {
            setPermissions(result);
        }).catch(error => {
            console.error("Failed to fetch permissions:", error);
        })
    }

    useEffect(() => {
        if (session?.user?.token) {
            getPermissions()
        }

        if (roleData) {
            setNewRole({
                id: roleData.id,
                name: roleData.name,
                permissions: roleData.permissions
            });
        }

    }, [roleData]);


    const handleEdit =  async () => {

        const name = newRole.name;
        const permissions = newRole.permissions;

        const Schema = RoleSchema(t_validation);

        const validation = Schema.safeParse({ name , permissions });
    
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        editRole(session?.user?.token,roleData.id,name,permissions).then((result) => {
            toast.success(result.message);
            refreshRolesList() 
            onClose();
        }).catch((error) => {
            toast.error(error.message);
        })        
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('edit_role')}</Modal.Header>
            <Modal.Body>
                <div className="space-y-4">
                    <div>
                        <Label>{t_general('name')}</Label>
                        <TextInput
                            value={newRole.name}
                            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                            placeholder={t_general('name')}
                        />
                    </div>
                    <div>
                        <Label>{t('permissions')}</Label>
                        <Select
                            multiple
                            required
                            onChange={(e) =>
                                setNewRole({
                                    ...newRole,
                                    permissions: Array.from(e.target.selectedOptions, (option) => Number(option.value)),
                                })
                            }
                        >
                            {permissions.map((permission) => (
                                
                                <option
                                    key={permission.id}
                                    value={permission.id}
                                >
                                    {permission.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleEdit} color="green">{t_general('edit')}</Button>
                <Button onClick={onClose} color="gray">{t_general('cancel')}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModal;
