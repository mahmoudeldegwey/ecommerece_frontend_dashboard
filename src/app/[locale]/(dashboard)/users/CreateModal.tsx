import { useState,useEffect } from 'react'
import { Modal, Button, TextInput, Label,Select } from "flowbite-react";
import {useTranslations} from 'next-intl';
import  { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import { UserSchema} from "@/utils/validationSchema";
import {usersList,createUser} from '@/utils/actions/users/actions'
import {rolesList} from '@/utils/actions/roles/actions'

interface User {
    name: string;
    email: string;
    password: string;
    password_confirmation:string
    role_id: number;
}

interface CreateModal {
    isOpen: boolean;
    onClose: () => void;
    refreshUsersList:() => void
}

const CreateModal: React.FC<CreateModal> = ({ isOpen, onClose, refreshUsersList }) => {
    const [newUser, setNewUser] = useState<User>({ name: "", email:"",password:"",password_confirmation:"",role_id: 0});
    
    const [roles, setRoles] = useState([]);

    const { data: session } = useSession();
    
    const t = useTranslations('UsersPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    const getRoles = async () => {
        
        rolesList(session?.user?.token).then( result => {
            setRoles(result.data);
        }).catch(error => {
            throw new Error(`HTTP error! Status:`);
        })
    }

    useEffect(() => {
        if (session?.user?.token) {
            getRoles();
        }
    }, [session]);


    const handleCreate =  async () => {

        const name = newUser.name;
        const email = newUser.email;
        const password = newUser.password;
        const password_confirmation = newUser.password_confirmation;
        const role_id = newUser.role_id;

        const schema = UserSchema(t_validation)
        
        const validation = schema.safeParse({ name , email, password , password_confirmation  , role_id });
 
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        createUser(session?.user?.token,name,email, password, password_confirmation ,role_id).then((result) => {
            toast.success(result.message);
            refreshUsersList() 
            onClose();
        }).catch((error) => {
            toast.error(error.message);
        })        
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('create_user')}</Modal.Header>
            <Modal.Body>
                <div className="space-y-4">
                    <div>
                        <Label>{t_general('name')}</Label>
                        <TextInput
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            placeholder={t_general('name')}
                        />
                    </div>
                    <div>
                        <Label>{t_general('email')}</Label>
                        <TextInput
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            placeholder={t_general('email')}
                        />
                    </div>
                    <div>
                        <Label>{t_general('password')}</Label>
                        <TextInput
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            placeholder={t_general('password')}
                            type='password'
                        />
                    </div>
                    <div>
                        <Label>{t_general('password_confirmation')}</Label>
                        <TextInput
                            value={newUser.password_confirmation}
                            onChange={(e) => setNewUser({ ...newUser, password_confirmation: e.target.value })}
                            placeholder={t_general('password_confirmation')}
                            type='password'
                        />
                    </div>
                    <div>
                        <Label>{t_general('roles')}</Label>
                        <Select id="countries" required
                            onChange={(e) => setNewUser({ ...newUser, roles: Array.from(e.target.selectedOptions, (option) => Number(option.value)) })}
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
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
