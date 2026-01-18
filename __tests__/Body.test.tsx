import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Body } from '../src';
import type { BodyPartSlug, BodyPartData } from '../src';

describe('Body Component', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Body data={[]} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('renders male front view by default', () => {
      render(<Body data={[]} />);
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'male-body-front');
    });

    it('renders male back view when side="back"', () => {
      render(<Body data={[]} side="back" />);
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'male-body-back');
    });

    it('renders female front view', () => {
      render(<Body data={[]} gender="female" />);
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'female-body-front');
    });

    it('renders female back view', () => {
      render(<Body data={[]} gender="female" side="back" />);
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'female-body-back');
    });
  });

  describe('Color Highlighting', () => {
    it('highlights body part with specified color', () => {
      const data: BodyPartData[] = [{ slug: 'left-biceps', color: '#ff0000' }];
      render(<Body data={data} />);

      const paths = screen.getAllByTestId('left-biceps');
      expect(paths.length).toBeGreaterThan(0);
      paths.forEach(path => {
        expect(path).toHaveAttribute('fill', '#ff0000');
      });
    });

    it('applies defaultFill to non-highlighted parts', () => {
      render(<Body data={[]} defaultFill="#cccccc" />);

      // Find any body part that's not highlighted
      const paths = screen.getAllByTestId('left-biceps');
      paths.forEach(path => {
        expect(path).toHaveAttribute('fill', '#cccccc');
      });
    });

    it('highlights multiple body parts with different colors', () => {
      const data: BodyPartData[] = [
        { slug: 'left-biceps', color: '#ff0000' },
        { slug: 'right-biceps', color: '#00ff00' },
      ];
      render(<Body data={data} />);

      screen.getAllByTestId('left-biceps').forEach(path => {
        expect(path).toHaveAttribute('fill', '#ff0000');
      });
      screen.getAllByTestId('right-biceps').forEach(path => {
        expect(path).toHaveAttribute('fill', '#00ff00');
      });
    });
  });

  describe('Click Handling', () => {
    it('calls onClick with correct slug when body part clicked', () => {
      const handleClick = jest.fn();
      render(<Body data={[]} onClick={handleClick} />);

      const path = screen.getAllByTestId('left-biceps')[0];
      fireEvent.click(path);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith('left-biceps', expect.any(Object));
    });

    it('passes MouseEvent as second argument to onClick', () => {
      const handleClick = jest.fn();
      render(<Body data={[]} onClick={handleClick} />);

      const path = screen.getAllByTestId('left-biceps')[0];
      fireEvent.click(path);

      const [slug, event] = handleClick.mock.calls[0];
      expect(slug).toBe('left-biceps');
      expect(event).toHaveProperty('type', 'click');
    });
  });

  describe('Interactive States', () => {
    it('shows cursor:pointer on interactive body parts', () => {
      render(<Body data={[]} />);

      const path = screen.getAllByTestId('left-biceps')[0];
      expect(path).toHaveStyle({ cursor: 'pointer' });
    });

    it('shows cursor:default on disabled body parts', () => {
      render(<Body data={[]} disabledParts={['left-biceps']} />);

      const paths = screen.getAllByTestId('left-biceps');
      paths.forEach(path => {
        expect(path).toHaveStyle({ cursor: 'default' });
      });
    });

    it('sets aria-disabled on disabled body parts', () => {
      render(<Body data={[]} disabledParts={['left-biceps']} />);

      const paths = screen.getAllByTestId('left-biceps');
      paths.forEach(path => {
        expect(path).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('applies gray color to disabled body parts', () => {
      render(<Body data={[{ slug: 'left-biceps', color: '#ff0000' }]} disabledParts={['left-biceps']} />);

      const paths = screen.getAllByTestId('left-biceps');
      paths.forEach(path => {
        expect(path).toHaveAttribute('fill', '#EBEBE4');
      });
    });

    it('does not call onClick on disabled body parts', () => {
      const handleClick = jest.fn();
      render(<Body data={[]} onClick={handleClick} disabledParts={['left-biceps']} />);

      const path = screen.getAllByTestId('left-biceps')[0];
      fireEvent.click(path);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Hidden Parts', () => {
    it('does not render hidden body parts', () => {
      render(<Body data={[]} hiddenParts={['left-biceps']} />);

      expect(screen.queryByTestId('left-biceps')).not.toBeInTheDocument();
    });

    it('renders other parts when some are hidden', () => {
      render(<Body data={[]} hiddenParts={['left-biceps']} />);

      // right-biceps should still be rendered
      expect(screen.getAllByTestId('right-biceps').length).toBeGreaterThan(0);
    });
  });

  describe('Scaling', () => {
    it('applies scale to SVG dimensions', () => {
      render(<Body data={[]} scale={2} />);

      const svg = screen.getByRole('img');
      // Default is 200x400, scaled by 2 should be 400x800
      expect(svg).toHaveAttribute('width', '400');
      expect(svg).toHaveAttribute('height', '800');
    });
  });

  describe('Accessibility', () => {
    it('applies role="button" to body parts', () => {
      render(<Body data={[{ slug: 'abs', color: '#ff0000' }]} />);
      const parts = screen.getAllByTestId('abs');
      parts.forEach(part => {
        expect(part).toHaveAttribute('role', 'button');
      });
    });

    it('applies aria-label with readable name', () => {
      render(<Body data={[{ slug: 'left-biceps', color: '#ff0000' }]} />);
      const parts = screen.getAllByTestId('left-biceps');
      parts.forEach(part => {
        expect(part).toHaveAttribute('aria-label', 'left biceps');
      });
    });

    it('makes body parts keyboard focusable', () => {
      render(<Body data={[{ slug: 'abs', color: '#ff0000' }]} />);
      const parts = screen.getAllByTestId('abs');
      parts.forEach(part => {
        expect(part).toHaveAttribute('tabindex', '0');
      });
    });

    it('excludes disabled parts from tab order', () => {
      render(<Body data={[{ slug: 'abs', color: '#ff0000' }]} disabledParts={['abs']} />);
      const parts = screen.getAllByTestId('abs');
      parts.forEach(part => {
        expect(part).toHaveAttribute('tabindex', '-1');
      });
    });

    it('triggers onClick on Enter key', () => {
      const handleClick = jest.fn();
      render(<Body data={[{ slug: 'abs', color: '#ff0000' }]} onClick={handleClick} />);
      const part = screen.getAllByTestId('abs')[0];
      fireEvent.keyDown(part, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledWith('abs', expect.any(Object));
    });

    it('triggers onClick on Space key', () => {
      const handleClick = jest.fn();
      render(<Body data={[{ slug: 'abs', color: '#ff0000' }]} onClick={handleClick} />);
      const part = screen.getAllByTestId('abs')[0];
      fireEvent.keyDown(part, { key: ' ' });
      expect(handleClick).toHaveBeenCalledWith('abs', expect.any(Object));
    });
  });
});
