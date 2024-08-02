import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import useToggle from '../hooks/useToggle';
import useAuth from '../hooks/useAuth';
const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useAuth(); // Ensure useAuth is correctly imported and used

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [check, toggleCheck] = useToggle('persist', false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            setAuth({ user, accessToken });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <section style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <p ref={errRef} style={{ color: 'red', visibility: errMsg ? 'visible' : 'hidden' }} aria-live="assertive">
                {errMsg}
            </p>
            <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>Sign In</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="username" style={{ marginBottom: '10px' }}>Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                    style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
                />

                <label htmlFor="password" style={{ marginBottom: '10px' }}>Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                    style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
                />

                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>
                    Sign In
                </button>

                <div style={{ marginTop: '20px' }}>
                    <input
                        type='checkbox'
                        id='persist'
                        onChange={toggleCheck}
                        checked={check}
                        style={{ marginRight: '10px' }}
                    />
                    <label htmlFor='persist'>Trust this device</label>
                </div>
            </form>
            <p style={{ marginTop: '20px' }}>
                Need an Account?<br />
                <span style={{ fontWeight: 'bold', color: '#007bff' }}>
                    <Link to="/register" style={{ textDecoration: 'none', color: '#007bff' }}>Sign Up</Link>
                </span>
            </p>
        </section>
    );
};

export default Login;
