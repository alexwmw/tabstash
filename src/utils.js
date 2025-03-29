export function getGroupColorClasses(color) {
  const groupColors = {
    red: ['bg-red-50', 'border-red-300'],
    green: ['bg-green-50', 'border-green-300'],
    blue: ['bg-blue-50', 'border-blue-300'],
    grey: ['bg-gray-100', 'border-gray-400'],
    yellow: ['bg-yellow-50', 'border-yellow-300'],
    pink: ['bg-pink-50', 'border-pink-300'],
    purple: ['bg-purple-50', 'border-purple-300'],
    cyan: ['bg-cyan-50', 'border-cyan-300'],
    orange: ['bg-orange-50', 'border-orange-300'],
  };
  return groupColors[color];
}

export function getTagColorClasses(color) {
  const tagColors = {
    grey: ['text-gray-600', 'bg-gray-300'],
    blue: ['text-blue-800', 'bg-blue-200'],
    red: ['text-red-800', 'bg-red-200'],
    yellow: ['text-yellow-800', 'bg-yellow-200'],
    green: ['text-green-800', 'bg-green-200'],
    pink: ['text-pink-800', 'bg-pink-200'],
    purple: ['text-purple-800', 'bg-purple-200'],
    cyan: ['text-cyan-800', 'bg-cyan-200'],
    orange: ['text-orange-800', 'bg-orange-200'],
  };
  return tagColors[color];
}
