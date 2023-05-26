import { render, screen } from '@testing-library/react';
import React from 'react';
import PageOptions, { ELLIPSIS, HALF_MAX_LENGTH } from '../PageOptions';

describe('PageOptions', () => {
  test('should render page options', () => {
    render(<PageOptions totalPages={100} page={0} />);

    expect(screen.getByText('1')).toBeVisible();
    expect(screen.getByText('100')).toBeVisible();
    expect(screen.queryByText('101')).not.toBeInTheDocument();
    expect(screen.queryAllByText(ELLIPSIS)).toHaveLength(0);
    expect(screen.getAllByText(/.+/i)).toHaveLength(100);
  });

  describe('should limit the number of page options rendered', () => {
    const totalPages = 10_000;

    test('should render limited page options when selected page is first page', () => {
      render(<PageOptions totalPages={totalPages} page={0} />);

      expect(screen.getByText('1')).toBeVisible();
      expect(screen.getByText('1000')).toBeVisible();
      expect(screen.queryByText('1001')).not.toBeInTheDocument();
      expect(screen.getAllByText(ELLIPSIS)).toHaveLength(1);
      expect(screen.getAllByText(/.+/i)).toHaveLength(1001);
    });

    test('should render limited page options when selected page equal half max allowed length', () => {
      render(<PageOptions totalPages={totalPages} page={HALF_MAX_LENGTH} />);

      expect(screen.getByText('1')).toBeVisible();
      expect(screen.getByText('1000')).toBeVisible();
      expect(screen.queryByText('1001')).not.toBeInTheDocument();
      expect(screen.getAllByText(ELLIPSIS)).toHaveLength(1);
      expect(screen.getAllByText(/.+/i)).toHaveLength(1001);
    });

    test('should render limited page options when selected page is more than half max allowed length', () => {
      render(<PageOptions totalPages={totalPages} page={HALF_MAX_LENGTH + 1} />);

      expect(screen.queryByText('1')).not.toBeInTheDocument();
      expect(screen.getByText('2')).toBeVisible();
      expect(screen.getByText('1001')).toBeVisible();
      expect(screen.queryByText('1002')).not.toBeInTheDocument();
      expect(screen.getAllByText(ELLIPSIS)).toHaveLength(2);
      expect(screen.getAllByText(/.+/i)).toHaveLength(1002);
    });

    test('should render limited page options when last page is selected', () => {
      render(<PageOptions totalPages={totalPages} page={totalPages - 1} />);

      expect(screen.queryByText('9000')).not.toBeInTheDocument();
      expect(screen.getByText('9001')).toBeVisible();
      expect(screen.getByText('10000')).toBeVisible();
      expect(screen.queryByText('10001')).not.toBeInTheDocument();
      expect(screen.getAllByText(ELLIPSIS)).toHaveLength(1);
      expect(screen.getAllByText(/.+/i)).toHaveLength(1001);
    });
  });
});
