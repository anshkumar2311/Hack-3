
function page() {
    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <video
                src="videos/suk.mp4"
                style={{ width: '100%', height: '100%', objectFit: 'cover', border: 'none' }}
                autoPlay
                muted
                loop
                controls={false}
            />
        </div>
    )
}

export default page
