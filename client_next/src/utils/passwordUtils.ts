/**
 * Checks the strength of a password and returns a score and feedback
 * @param password The password to check
 * @returns Object containing score (0-4) and feedback
 */
export function checkPasswordStrength(password: string): { score: number, feedback: string } {
  if (!password) {
    return { score: 0, feedback: 'Password is required' };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long');
  } else {
    score += 1;
  }

  // Complexity checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!hasUppercase) {
    feedback.push('Add uppercase letters');
  }
  
  if (!hasLowercase) {
    feedback.push('Add lowercase letters');
  }
  
  if (!hasNumber) {
    feedback.push('Add numbers');
  }
  
  if (!hasSpecial) {
    feedback.push('Add special characters');
  }

  // Calculate score based on complexity
  const complexityCount = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  score += complexityCount;

  // Adjust score if password is too short
  if (password.length < 8) {
    score = Math.min(score, 1);
  }

  // Normalize score to 0-4 range
  score = Math.min(score, 4);

  return {
    score,
    feedback: feedback.length > 0 ? feedback.join(', ') : 'Strong password!'
  };
}
