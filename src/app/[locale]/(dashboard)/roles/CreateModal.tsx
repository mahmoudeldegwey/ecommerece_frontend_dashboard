import { useState,useEffect } from 'react'
import { Modal, Button, TextInput, Label,Select } from "flowbite-react";
import {useTranslations} from 'next-intl';
import  { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import { RoleSchema} from "@/utils/validationSchema";
import {rolesList,createRole} from '@/utils/actions/roles/actions'
import {permissionsList} from '@/utils/actions/permissions/action'

interface Role {
    name: string;
    permissions: number[];
}

interface CreateModal {
    isOpen: boolean;
    onClose: () => void;
    refreshRolesList:() => void
}

const CreateModal: React.FC<CreateModal> = ({ isOpen, onClose, refreshRolesList }) => {
    const [newRole, setNewRole] = useState<Role>({ name: "", permissions: []});
    
    const [permissions, setPermissions] = useState([]);

    const { data: session } = useSession();
    
    const t = useTranslations('RolesPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    const getPermissions = async () => {
        
        permissionsList(session?.user?.token).then( result => {
            setPermissions(result);
        }).catch(error => {
            throw new Error(`HTTP error! Status:`);
        })
    }

    useEffect(() => {
        if (session?.user?.token) {
            getPermissions();
        }
    }, [session]);


    const handleCreate =  async () => {

        const name = newRole.name;
        const permissions = newRole.permissions;
        const schema = RoleSchema(t_validation)
        
        const validation = schema.safeParse({ name , permissions });
 
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        createRole(session?.user?.token,name,permissions).then((result) => {
            toast.success(result.message);
            refreshRolesList() 
            onClose();
        }).catch((error) => {
            toast.error(error.message);
        })        
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('create_role')}</Modal.Header>
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
                        <Select id="permissions" multiple required
                            onChange={(e) => setNewRole({ ...newRole, permissions: Array.from(e.target.selectedOptions, (option) => Number(option.value)) })}
                        >
                            {permissions.map((permission) => (
                                <option key={permission.id} value={permission.id}>{permission.name}</option>
                            ))}                             
                        </Select>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleCreate} color="green">Create</Button>
                <Button onClick={onClose} color="gray">Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateModal;
