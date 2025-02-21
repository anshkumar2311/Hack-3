import React from 'react';
import Spline from '@splinetool/react-spline/next';

const Privacy = () => {
    return (
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '215vh', height: '100%', zIndex: -1, overflow: 'hidden' }}>
                <Spline
                    scene="https://prod.spline.design/HsulQ128ghx53z3H/scene.splinecode"
                />
            </div>
            <div style={{ position: 'relative', zIndex: 1, height: '100vh', overflowY: 'auto' }}>
                <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto', padding: '20px', color: '#ffffff', textAlign: 'center', backgroundColor: '#1a1a1a', opacity: 0.9 }}>
                    <h1 style={{ color: '#daa520', borderBottom: '2px solid #daa520', paddingBottom: '10px', fontWeight: 'bold' }}>NeuroWell Privacy Policy</h1>
                    <p className="last-updated" style={{ color: '#888', fontStyle: 'italic', marginBottom: '30px' }}>Last Updated: February 9, 2025</p>

                    <div className="section" style={{ marginBottom: '25px', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>Introduction</h2>
                        <p>Welcome to NeuroWell, a mental health chatbot designed to provide support and guidance. We take your privacy seriously and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>
                    </div>

                    <div className="section" style={{ marginBottom: '25px', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>Information We Collect</h2>
                        <p>We collect the following types of information:</p>
                        <ul style={{ listStylePosition: 'inside', paddingLeft: '0' }}>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}><strong style={{ color: '#ddd' }}>Personal Information:</strong> Name, email address, and age when you create an account</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}><strong style={{ color: '#ddd' }}>Chat Data:</strong> Conversations between you and the chatbot</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}><strong style={{ color: '#ddd' }}>Usage Data:</strong> Information about how you interact with our service, including access times and frequency of use</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}><strong style={{ color: '#ddd' }}>Device Information:</strong> Browser type, IP address, and device identifiers</li>
                        </ul>
                    </div>

                    <div className="section" style={{ marginBottom: '25px', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul style={{ listStylePosition: 'inside', paddingLeft: '0' }}>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Provide and improve our mental health support services</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Personalize your experience with the chatbot</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Analyze usage patterns to enhance our service</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Ensure the security and integrity of our platform</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Communicate important updates about our service</li>
                        </ul>
                    </div>

                    <div className="section" style={{ marginBottom: '25px', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>Data Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.</p>
                    </div>

                    <div className="section" style={{ marginBottom: '25px', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>Data Sharing and Disclosure</h2>
                        <p>We do not sell your personal information. We may share your data with:</p>
                        <ul style={{ listStylePosition: 'inside', paddingLeft: '0' }}>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Service providers who assist in operating our platform</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Law enforcement when required by law</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Emergency services if we believe you or someone else is at risk of serious harm</li>
                        </ul>
                    </div>

                    <div className="section" style={{ marginBottom: '25px', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul style={{ listStylePosition: 'inside', paddingLeft: '0' }}>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Access your personal information</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Correct inaccurate data</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Request deletion of your data</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Export your data</li>
                            <li style={{ textAlign: 'center', marginBottom: '10px' }}>Opt-out of certain data collection practices</li>
                        </ul>
                    </div>

                    <div className="section" style={{ marginBottom: '25px', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>Children's Privacy</h2>
                        <p>Our service is not intended for users under 13 years of age. We do not knowingly collect information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.</p>
                    </div>

                    <div className="section" style={{ marginBottom: '25px', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>Changes to This Privacy Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
                    </div>

                    <div className="section" style={{ marginBottom: '25px', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy or our practices, please contact us at:</p>
                        <p>Email: privacy@neurowell.com<br />
                            Address: Lovely Professional University, Jalandhar, Phagwara,144411</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
