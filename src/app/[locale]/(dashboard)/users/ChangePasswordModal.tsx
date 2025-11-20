import { useState,useEffect } from 'react'
import { Modal, Button, TextInput, Label,Select } from "flowbite-react";
import {useTranslations} from 'next-intl';
import  { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import { UserChangePasswordSchema} from "@/utils/validationSchema";
import {editPassword} from '@/utils/actions/users/actions'

interface User {
    id: number;
    password: string;
    password_confirmation:string;
}

interface ChangePasswordModal {
    isOpen: boolean;
    onClose: () => void;
    refreshUsersList:() => void;
    userData: User
}

const ChangePasswordModal: React.FC<ChangePasswordModal> = ({ isOpen, onClose, refreshUsersList, userData }) => {
    const [newUser, setNewUser] = useState<User>({ id:0 ,password: "", password_confirmation:""});
    
    const { data: session } = useSession();
    
    const t = useTranslations('UsersPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    useEffect(() => {

        if (userData) {
            setNewUser({
                id: userData.id,
                password: userData.password,
                password_confirmation: userData.password_confirmation,
            });
        }

    }, [userData]);


    const handleEdit =  async () => {
        const password = newUser.password;
        const password_confirmation = newUser.password_confirmation;

        const schema = UserChangePasswordSchema(t_validation)
        const validation = schema.safeParse({ password , password_confirmation });
    
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        editPassword(session?.user?.token,userData.id,password,password_confirmation).then((result) => {
            toast.success(result.message);
            refreshUsersList() 
            onClose();
        }).catch((error) => {
            toast.error(error.message);
        })        
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('change_password')}</Modal.Header>
            <Modal.Body>
                <div className="space-y-4">

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

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleEdit} color="green">{t_general('edit')}</Button>
                <Button onClick={onClose} color="gray">{t_general('cancel')}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangePasswordModal;
