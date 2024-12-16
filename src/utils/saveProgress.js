export const saveProgress = async ({ labId, progressData, currentContext, tasks }) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ labId, progressData, currentContext, tasks }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Server error:', result.message || result);
      throw new Error(result.message || 'Failed to save progress');
    }

    return { success: true, message: 'Configuration saved successfully.', result };
  } catch (error) {
    console.error('Error saving progress:', error);
    return { success: false, message: 'Network error while saving configuration.', error };
  }
};
