import Link from "next/link";
import { useState } from "react";
import { getCookie } from 'cookies-next';
import { GetServerSideProps } from "next";


interface HomePageProps {
  username: string | null;
}


export default function Loginlink({username}: HomePageProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
  
    return (
       
        <div className="navbar-menu">
          <ul>
            {/* Other nav links */}
          </ul>
          
          <div className="navbar-end">
            {!username ? (
              <Link href="/login">
                Login
              </Link>
            ) : (
              <div className="navbar-item has-dropdown">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="button is-text"
                >
                  {username}
                </button>
                {dropdownOpen && (
                  <div className="dropdown">
                    <Link href="/profile">
                      Profile
                    </Link>
                    <a href="#" className="dropdown-item" onClick={() => {/* handle logout logic */}}>
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
    );
  }


  export const getServerSideProps: GetServerSideProps = async (context) => {
    const req = context.req;
    const res = context.res;
    let username = getCookie('username', { req, res }) as string | null;
    if (!username) {
        username = null;
    }
    return { props: { username } };
};