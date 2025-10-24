export const avatarColorPairs = [
  { bg: "#FFCDD2", text: "#C62828" }, // red
  { bg: "#F8BBD0", text: "#AD1457" }, // pink
  { bg: "#E1BEE7", text: "#6A1B9A" }, // purple
  { bg: "#D1C4E9", text: "#4527A0" }, // deep purple
  { bg: "#C5CAE9", text: "#283593" }, // indigo
  { bg: "#BBDEFB", text: "#1565C0" }, // blue
  { bg: "#B3E5FC", text: "#0277BD" }, // light blue
  { bg: "#B2EBF2", text: "#00838F" }, // cyan
  { bg: "#B2DFDB", text: "#00695C" }, // teal
  { bg: "#C8E6C9", text: "#2E7D32" }, // green
  { bg: "#DCEDC8", text: "#558B2F" }, // light green
  { bg: "#F0F4C3", text: "#9E9D24" }, // lime
  { bg: "#FFF9C4", text: "#F9A825" }, // yellow
  { bg: "#FFECB3", text: "#FF8F00" }, // amber
  { bg: "#FFE0B2", text: "#EF6C00" }, // orange
  { bg: "#FFCCBC", text: "#D84315" }, // deep orange
  { bg: "#D7CCC8", text: "#4E342E" }, // brown
  { bg: "#F5F5F5", text: "#616161" }, // gray
  { bg: "#CFD8DC", text: "#37474F" }, // blue gray
  { bg: "#E0F2F1", text: "#004D40" }, // teal dark
  { bg: "#F1F8E9", text: "#33691E" }, // light green dark
  { bg: "#FFF3E0", text: "#E65100" }, // orange dark
  { bg: "#FBE9E7", text: "#BF360C" }, // deep orange dark
  { bg: "#EFEBE9", text: "#3E2723" }, // brown dark
  { bg: "#ECEFF1", text: "#263238" }, // blue gray dark
  { bg: "#E3F2FD", text: "#0D47A1" }, // dark blue
  { bg: "#FCE4EC", text: "#880E4F" }, // dark pink
  { bg: "#F3E5F5", text: "#4A148C" }, // dark purple
  { bg: "#EDE7F6", text: "#311B92" }, // deep purple
  { bg: "#E8EAF6", text: "#1A237E" }, // dark indigo
];

export const getAvatarColorPair = (length: number) => {
  const randomOffset = Math.floor(Math.random() * avatarColorPairs.length);
  const index = (length + randomOffset) % avatarColorPairs.length;
  return avatarColorPairs[index];
};
