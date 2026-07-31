import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CourseCard from './CourseCard';

function renderCard(ui) {
  return render(ui, { wrapper: MemoryRouter });
}

const baseProps = {
  title: 'Full-Stack Web Development',
  author: 'Ananya Rao',
  totalLessons: 4,
  durationWeeks: 10,
  category: 'Development',
};

describe('CourseCard', () => {
  it('renders the real course data passed to it', () => {
    renderCard(<CourseCard {...baseProps} />);

    expect(screen.getByText('Full-Stack Web Development')).toBeInTheDocument();
    expect(screen.getByText('Ananya Rao')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('4 lessons')).toBeInTheDocument();
    expect(screen.getByText('10 wk')).toBeInTheDocument();
  });

  it('does not render an Enroll button when onEnroll is not provided', () => {
    renderCard(<CourseCard {...baseProps} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows an enabled "Enroll" button and calls onEnroll when clicked', async () => {
    const user = userEvent.setup();
    const onEnroll = vi.fn();

    renderCard(<CourseCard {...baseProps} onEnroll={onEnroll} enrolled={false} />);

    const button = screen.getByRole('button', { name: 'Enroll' });
    expect(button).toBeEnabled();

    await user.click(button);
    expect(onEnroll).toHaveBeenCalledTimes(1);
  });

  it('shows a disabled "Enrolled" button once already enrolled', () => {
    renderCard(<CourseCard {...baseProps} onEnroll={() => {}} enrolled={true} />);

    const button = screen.getByRole('button', { name: 'Enrolled' });
    expect(button).toBeDisabled();
  });

  it('shows the enrolled student count when provided', () => {
    renderCard(<CourseCard {...baseProps} enrolledCount={3} />);

    expect(screen.getByText('3 students enrolled')).toBeInTheDocument();
  });

  it('shows an Edit link when editHref is provided, and no Enroll button', () => {
    renderCard(<CourseCard {...baseProps} editHref="/courses/1/edit" />);

    const link = screen.getByRole('link', { name: 'Edit' });
    expect(link).toHaveAttribute('href', '/courses/1/edit');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
