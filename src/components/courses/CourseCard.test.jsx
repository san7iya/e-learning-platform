import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseCard from './CourseCard';

const baseProps = {
  title: 'Full-Stack Web Development',
  author: 'Ananya Rao',
  progress: 0,
  lessonsDone: 0,
  totalLessons: 4,
  category: 'Development',
};

describe('CourseCard', () => {
  it('renders the real course data passed to it', () => {
    render(<CourseCard {...baseProps} />);

    expect(screen.getByText('Full-Stack Web Development')).toBeInTheDocument();
    expect(screen.getByText('Ananya Rao')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('Lesson 0 of 4')).toBeInTheDocument();
  });

  it('does not render an Enroll button when onEnroll is not provided', () => {
    render(<CourseCard {...baseProps} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows an enabled "Enroll" button and calls onEnroll when clicked', async () => {
    const user = userEvent.setup();
    const onEnroll = vi.fn();

    render(<CourseCard {...baseProps} onEnroll={onEnroll} enrolled={false} />);

    const button = screen.getByRole('button', { name: 'Enroll' });
    expect(button).toBeEnabled();

    await user.click(button);
    expect(onEnroll).toHaveBeenCalledTimes(1);
  });

  it('shows a disabled "Enrolled" button once already enrolled', () => {
    render(<CourseCard {...baseProps} onEnroll={() => {}} enrolled={true} />);

    const button = screen.getByRole('button', { name: 'Enrolled' });
    expect(button).toBeDisabled();
  });
});
