import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Body, BodyPartData, BodyPartSlug } from '../src';

const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];

function App() {
  const [data, setData] = useState<BodyPartData[]>([
    { slug: 'left-biceps', color: '#ff6b6b' },
    { slug: 'right-biceps', color: '#ff6b6b' },
    { slug: 'abs', color: '#4ecdc4' },
    { slug: 'left-quadriceps', color: '#45b7d1' },
    { slug: 'right-quadriceps', color: '#45b7d1' },
  ]);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [lastClicked, setLastClicked] = useState<string>('None');
  const [colorIndex, setColorIndex] = useState(0);

  const handleClick = (slug: BodyPartSlug) => {
    setLastClicked(slug);

    // Toggle: if already highlighted, remove it; otherwise add with next color
    const existing = data.find(d => d.slug === slug);
    if (existing) {
      setData(data.filter(d => d.slug !== slug));
    } else {
      const newColor = COLORS[colorIndex % COLORS.length];
      setData([...data, { slug, color: newColor }]);
      setColorIndex(colorIndex + 1);
    }
  };

  const clearAll = () => {
    setData([]);
    setLastClicked('None');
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '10px' }}>react-body-highlighter Demo</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>Click on body parts to highlight them. Click again to remove.</p>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Body Display */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <Body
              data={data}
              onClick={handleClick}
              gender={gender}
              side={side}
              scale={1.5}
            />
          </div>
        </div>

        {/* Controls */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Controls</h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Gender:</label>
              <button
                onClick={() => setGender('male')}
                style={{
                  padding: '8px 16px',
                  marginRight: '10px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: gender === 'male' ? '#4ecdc4' : '#dfe6e9',
                  color: gender === 'male' ? 'white' : '#333',
                }}
              >
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: gender === 'female' ? '#4ecdc4' : '#dfe6e9',
                  color: gender === 'female' ? 'white' : '#333',
                }}
              >
                Female
              </button>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Side:</label>
              <button
                onClick={() => setSide('front')}
                style={{
                  padding: '8px 16px',
                  marginRight: '10px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: side === 'front' ? '#45b7d1' : '#dfe6e9',
                  color: side === 'front' ? 'white' : '#333',
                }}
              >
                Front
              </button>
              <button
                onClick={() => setSide('back')}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: side === 'back' ? '#45b7d1' : '#dfe6e9',
                  color: side === 'back' ? 'white' : '#333',
                }}
              >
                Back
              </button>
            </div>

            <button
              onClick={clearAll}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                background: '#ff6b6b',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Clear All
            </button>
          </div>

          <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Last Clicked</h3>
            <code style={{
              background: '#e9ecef',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '16px'
            }}>
              {lastClicked}
            </code>
          </div>

          <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Highlighted Parts ({data.length})</h3>
            {data.length === 0 ? (
              <p style={{ color: '#999' }}>No parts highlighted. Click on the body to add.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {data.map(({ slug, color }) => (
                  <span
                    key={slug}
                    style={{
                      background: color,
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    {slug}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#2d3436', borderRadius: '12px', color: '#dfe6e9' }}>
        <h3 style={{ marginTop: 0, color: '#fff' }}>Usage Example</h3>
        <pre style={{ margin: 0, overflow: 'auto' }}>
{`import { Body } from 'react-body-highlighter';

<Body
  data={${JSON.stringify(data.slice(0, 3), null, 2)}}
  onClick={(slug) => console.log('Clicked:', slug)}
  gender="${gender}"
  side="${side}"
/>`}
        </pre>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
