
import React from 'react';
import { Link } from 'react-router-dom';

const ActivityFooter = () => {
  return (
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LittleBranchPH</h3>
              <p className="text-gray-300">
              The Largest Kids Activity Platform in the Philippines.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="/activities" className="text-gray-300 hover:text-white">Activities</a></li>
                <li><a href="/saved" className="text-gray-300 hover:text-white">Saved Activities</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300"><i className='bx bxs-envelope'></i> littlebranchph@gmail.com</p>
              <Link to={'https://www.linkedin.com/company/littlebranchph'} target="_blank">
                <p className="text-gray-300"><i className='bx bxl-linkedin-square'></i> Littlebranch PH</p>
              </Link>
              <Link to={'https://www.instagram.com/littlebranchph/'} target="_blank">
                <p className="text-gray-300"><i className='bx bxl-instagram'></i> @littlebranchph</p>
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} LittleBranchPH. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
};

export default ActivityFooter;
