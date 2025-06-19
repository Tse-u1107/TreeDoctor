import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../../utils/sessionUtils';

const SessionCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const session = getSession();
        if (session) {
            navigate('/home');
        }
    }, [navigate]);

    return null;
};

export default SessionCheck;