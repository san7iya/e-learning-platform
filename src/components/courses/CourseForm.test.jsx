import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseForm from './CourseForm';

function fillRequiredFields(user, title = 'My Course') {
  return user.type(screen.getByPlaceholderText('e.g. Introduction to Machine Learning'), title);
}

describe('CourseForm lessons', () => {
  it('starts with no lesson rows when creating a course', () => {
    render(<CourseForm onSubmit={() => {}} submitLabel="Create course" />);

    expect(screen.queryByPlaceholderText('Lesson title')).not.toBeInTheDocument();
  });

  it('adds and removes lesson rows', async () => {
    const user = userEvent.setup();
    render(<CourseForm onSubmit={() => {}} submitLabel="Create course" />);

    await user.click(screen.getByRole('button', { name: '+ Add lesson' }));
    await user.click(screen.getByRole('button', { name: '+ Add lesson' }));
    expect(screen.getAllByPlaceholderText('Lesson title')).toHaveLength(2);

    await user.click(screen.getAllByRole('button', { name: 'Remove lesson' })[0]);
    expect(screen.getAllByPlaceholderText('Lesson title')).toHaveLength(1);
  });

  it('pre-fills lesson rows from initialValues when editing', () => {
    render(
      <CourseForm
        initialValues={{ title: 'Existing', modules: [{ title: 'Intro', duration_minutes: 30 }] }}
        onSubmit={() => {}}
        submitLabel="Save changes"
      />
    );

    expect(screen.getByDisplayValue('Intro')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('submits only lessons with a non-empty title, trimmed and with numeric duration', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CourseForm onSubmit={onSubmit} submitLabel="Create course" />);

    await fillRequiredFields(user);

    await user.click(screen.getByRole('button', { name: '+ Add lesson' }));
    await user.click(screen.getByRole('button', { name: '+ Add lesson' }));

    const titleInputs = screen.getAllByPlaceholderText('Lesson title');
    const durationInputs = screen.getAllByPlaceholderText('min');

    await user.type(titleInputs[0], '  Real Lesson  ');
    await user.type(durationInputs[0], '45');
    // second row left blank on purpose — should be dropped on submit

    await user.click(screen.getByRole('button', { name: 'Create course' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        modules: [{ title: 'Real Lesson', duration_minutes: 45 }]
      })
    );
  });
});
