export const ProdEnv = 'prod';
export const DevEnv = 'dev';

export const trimText = (text, maxLength) => {
  return text?.length > maxLength
    ? text?.substring(0, maxLength) + '...'
    : text;
};

export function formatNumberGlobally(input, raw = false) {
  // Handle input as a string or number
  const num = typeof input === 'number' ? input : parseFloat(input);

  // Check if the number is valid
  if (Number.isNaN(num)) {
    return '--'; // Return "--" if the input is not a number
  }

  // For integers, force 2 decimal places (e.g. 11 becomes 11.00)
  const formattedNum = num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // If raw is true, return the number as a float (no formatting)
  if (raw) {
    return parseFloat(formattedNum?.replace?.(/,/g, ''));
  }

  return formattedNum;
}

export const roundToTwo = (num) => Math.round(num * 100) / 100;

export const hasUpToTwoDecimalPlaces = (number) => {
  // Convert number to string
  const numberStr = number.toString();
  // Check if the string representation of the number has up to 2 decimal places
  if (numberStr.includes('.')) {
    const decimalPart = numberStr.split('.')[1];
    return decimalPart.length <= 2;
  }
  return true; // If there's no decimal point, it's up to 2 decimal places by default
};

export const getStringSegments = (string = '', segmentLength = 50) => {
  const segments = [];
  let lastIndex = 0;
  while (lastIndex < string?.length) {
    let endIndex = Math.min(lastIndex + segmentLength, string?.length);
    if (endIndex < string?.length && string?.[endIndex] !== ' ') {
      const lastSpaceIndex = string?.lastIndexOf(' ', endIndex);
      endIndex = lastSpaceIndex > lastIndex ? lastSpaceIndex : endIndex;
    }
    segments.push(string?.substring(lastIndex, endIndex));

    if (string?.[endIndex] !== ' ') {
      lastIndex = endIndex;
    } else {
      lastIndex = endIndex + 1;
    }
  }
  return segments;
};

export const transformAccounts = (allAccounts, anchorTier, type) => {
  let typeIds;

  // eslint-disable-next-line no-unused-expressions
  type === 'expense'
    ? (typeIds = {
        Expenses: 1,
        Income: 2,
        Liabilities: 3,
        Equity: 4,
        Assets: 5,
      })
    : (typeIds = {
        Income: 1,
        Expenses: 2,
        Equity: 3,
        Assets: 4,
        Liabilities: 5,
      });

  let filteredAccounts;

  if (anchorTier === 'CATEGORY_PHYSICAL_ACCOUNT') {
    filteredAccounts = allAccounts?.filter(
      (account) => account?.subType?.anchorTier !== 'PHYSICAL_ACCOUNT',
    );
  } else if (anchorTier === 'PHYSICAL_ACCOUNT') {
    filteredAccounts = allAccounts?.filter(
      (account) =>
        account?.subType?.anchorTier === anchorTier ||
        account?.subType?.name === 'Other Short-Term Asset' ||
        account?.subType?.name === 'Other Long-Term Asset',
    );
  } else {
    filteredAccounts = allAccounts;
  }

  const groupedByType = filteredAccounts?.reduce((acc, current) => {
    const type = current.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(current);
    return acc;
  }, {});

  for (const type in groupedByType) {
    groupedByType[type].sort((a, b) => a.name.localeCompare(b.name));
  }

  const transformed = Object.keys(groupedByType).map((type) => ({
    id: typeIds[type],
    name: type,
    categories: groupedByType[type],
  }));

  transformed.sort((a, b) => a.id - b.id);

  return transformed;
};

export const newTransformAccounts = (allAccounts, anchorTier, type) => {
  let typeIds;

  // eslint-disable-next-line no-unused-expressions
  type === 'expense'
    ? (typeIds = {
        Expenses: 1,
        Income: 2,
        Liabilities: 3,
        Equity: 4,
        Assets: 5,
      })
    : (typeIds = {
        Income: 1,
        Expenses: 2,
        Equity: 3,
        Assets: 4,
        Liabilities: 5,
      });

  let filteredAccounts;

  if (anchorTier === 'CATEGORY_PHYSICAL_ACCOUNT') {
    filteredAccounts = allAccounts?.filter(
      (account) => account?.subType?.anchorTier !== 'PHYSICAL_ACCOUNT',
    );
  } else if (anchorTier === 'PHYSICAL_ACCOUNT') {
    filteredAccounts = allAccounts?.filter(
      (account) =>
        account?.subType?.anchorTier === anchorTier ||
        account?.subType?.name === 'Other Short-Term Asset' ||
        account?.subType?.name === 'Other Long-Term Asset',
    );
  }

  const groupedByType = filteredAccounts?.reduce((acc, current) => {
    const type = current.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(current);
    return acc;
  }, {});

  for (const type in groupedByType) {
    groupedByType[type].sort((a, b) => a.name.localeCompare(b.name));
  }

  const transformed = Object.keys(groupedByType).map((type) => ({
    id: typeIds[type],
    name: type,
    categories: groupedByType[type],
  }));

  transformed.sort((a, b) => a.id - b.id);

  return transformed;
};
