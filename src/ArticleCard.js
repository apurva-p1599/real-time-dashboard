const ArticleCard = ({ article }) => {
    const { author, description, title, source, url, urlToImage } = article;
  
    return (
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
          margin: '10px',
          cursor: 'pointer',
          transition: 'box-shadow 0.3s',
          width: '300px', // Fixed width for consistent layout
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
        onClick={() => window.open(url, '_blank')}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)')}
      >
        <div
          style={{
            width: '100%',
            height: '300px', // Fixed height
            backgroundColor: urlToImage ? 'transparent' : 'black', // Black if no image
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {urlToImage && (
            <img
              src={urlToImage}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', // Cover to maintain aspect ratio
                borderRadius: '8px',
              }}
            />
          )}
        </div>
        <h3 style={{ fontSize: '18px', margin: '10px 0' }}>{title}</h3>
        <p style={{ fontStyle: 'italic', margin: '5px 0' }}><strong>Author:</strong> {author}</p>
        <p>{description}</p>
        <p><strong>Source:</strong> {source.name}</p>
      </div>
    );
  };
  
  export default ArticleCard;
  