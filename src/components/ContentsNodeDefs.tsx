import {
  COLOR_BLACK,
  COLOR_WHITE,
  EDGE_MARKER_WIDTH,
  NODE_HEIGHT,
  NODE_WIDTH,
} from "../utils/constants";

export const ContentsNodeDefs: React.FC = () => {
  return (
    <defs>
      {/* マーカー部分 */}
      <marker
        id="edge-arrowhead"
        markerWidth={EDGE_MARKER_WIDTH}
        markerHeight={EDGE_MARKER_WIDTH}
        refX={EDGE_MARKER_WIDTH / 2}
        refY={EDGE_MARKER_WIDTH / 2}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle
          cx={EDGE_MARKER_WIDTH / 2}
          cy={EDGE_MARKER_WIDTH / 2}
          r={EDGE_MARKER_WIDTH / 2 - 1}
          fill={COLOR_WHITE}
          stroke={COLOR_BLACK}
          strokeWidth="2"
        />
        <circle
          cx={EDGE_MARKER_WIDTH / 2}
          cy={EDGE_MARKER_WIDTH / 2}
          r={EDGE_MARKER_WIDTH / 4}
          fill={COLOR_BLACK}
        />
      </marker>
      <marker
        id="edge-arrowhead-disabled"
        markerWidth={EDGE_MARKER_WIDTH}
        markerHeight={EDGE_MARKER_WIDTH}
        refX={EDGE_MARKER_WIDTH / 2}
        refY={EDGE_MARKER_WIDTH / 2}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle
          cx={EDGE_MARKER_WIDTH / 2}
          cy={EDGE_MARKER_WIDTH / 2}
          r={EDGE_MARKER_WIDTH / 4}
          fill={COLOR_BLACK}
        />
      </marker>

      {/* Nodeボタン */}
      <g id="node-reproduction" className="cursor-pointer">
        <circle cx={0} cy={0} r={EDGE_MARKER_WIDTH} fill={COLOR_BLACK} />
        <rect
          x={0 - EDGE_MARKER_WIDTH / 4 - 1}
          y={0 - EDGE_MARKER_WIDTH / 4 - 1}
          width={EDGE_MARKER_WIDTH / 2}
          height={EDGE_MARKER_WIDTH / 2}
          fill={COLOR_WHITE}
          rx="1.0"
          opacity="0.8"
        />
        <rect
          x={0 - EDGE_MARKER_WIDTH / 4 + 2}
          y={0 - EDGE_MARKER_WIDTH / 4 + 2}
          width={EDGE_MARKER_WIDTH / 2}
          height={EDGE_MARKER_WIDTH / 2}
          fill={COLOR_WHITE}
          rx="1.0"
          opacity="1"
        />
      </g>

      <g id="node-remove" className="cursor-pointer">
        <circle cx={0} cy={0} r={EDGE_MARKER_WIDTH} fill={COLOR_BLACK} />
        <line
          x1={-EDGE_MARKER_WIDTH / 2}
          y1={-EDGE_MARKER_WIDTH / 2}
          x2={EDGE_MARKER_WIDTH / 2}
          y2={EDGE_MARKER_WIDTH / 2}
          stroke={COLOR_WHITE}
          strokeWidth={EDGE_MARKER_WIDTH / 6}
          strokeLinecap="round"
        />
        <line
          x1={EDGE_MARKER_WIDTH / 2}
          y1={-EDGE_MARKER_WIDTH / 2}
          x2={-EDGE_MARKER_WIDTH / 2}
          y2={EDGE_MARKER_WIDTH / 2}
          stroke={COLOR_WHITE}
          strokeWidth={EDGE_MARKER_WIDTH / 6}
          strokeLinecap="round"
        />
      </g>

      {/* Node背景 */}
      <g id="node-background">
        <rect
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          fill={COLOR_BLACK}
          opacity={0.3}
          rx={EDGE_MARKER_WIDTH / 4 + 2}
        />
        <rect
          x={EDGE_MARKER_WIDTH / 4}
          y={EDGE_MARKER_WIDTH / 4}
          width={NODE_WIDTH - EDGE_MARKER_WIDTH / 2}
          height={NODE_HEIGHT - EDGE_MARKER_WIDTH / 2}
          fill={COLOR_WHITE}
          rx={EDGE_MARKER_WIDTH / 4}
        />
      </g>

      <g id="node-background-selected">
        <rect
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          fill={COLOR_BLACK}
          opacity={1}
          rx={EDGE_MARKER_WIDTH / 4 + 2}
        />
        <rect
          x={EDGE_MARKER_WIDTH / 4}
          y={EDGE_MARKER_WIDTH / 4}
          width={NODE_WIDTH - EDGE_MARKER_WIDTH / 2}
          height={NODE_HEIGHT - EDGE_MARKER_WIDTH / 2}
          fill={COLOR_WHITE}
          rx={EDGE_MARKER_WIDTH / 4}
        />
      </g>

      <symbol
        id="node-foreground-0"
        viewBox="0 -960 960 960"
        fill={COLOR_BLACK}
      >
        {/* https://github.com/google/material-design-icons/blob/master/LICENSE */}
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M280-160v-520H80v-120h520v120H400v520H280Zm360 0v-320H520v-120h360v120H760v320H640Z"
        />
      </symbol>

      <symbol
        id="node-foreground-1"
        viewBox="0 -960 960 960"
        fill={COLOR_BLACK}
      >
        {/* https://github.com/google/material-design-icons/blob/master/LICENSE */}
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm320-80h320v-480H638l-73-80h-85v560Z"
        />
      </symbol>

      <symbol
        id="node-foreground-2"
        viewBox="0 -960 960 960"
        fill={COLOR_BLACK}
      >
        {/* https://github.com/google/material-design-icons/blob/master/LICENSE */}
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="m380-340 280-180-280-180v360Zm-60 220v-80H160q-33 0-56.5-23.5T80-280v-480q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v480q0 33-23.5 56.5T800-200H640v80H320ZM160-280h640v-480H160v480Zm0 0v-480 480Z"
        />
      </symbol>

      <symbol
        id="node-foreground-3"
        viewBox="0 -960 960 960"
        fill={COLOR_BLACK}
      >
        {/* https://github.com/google/material-design-icons/blob/master/LICENSE */}
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M560-160v-80h120q17 0 28.5-11.5T720-280v-80q0-38 22-69t58-44v-14q-36-13-58-44t-22-69v-80q0-17-11.5-28.5T680-720H560v-80h120q50 0 85 35t35 85v80q0 17 11.5 28.5T840-560h40v160h-40q-17 0-28.5 11.5T800-360v80q0 50-35 85t-85 35H560Zm-280 0q-50 0-85-35t-35-85v-80q0-17-11.5-28.5T120-400H80v-160h40q17 0 28.5-11.5T160-600v-80q0-50 35-85t85-35h120v80H280q-17 0-28.5 11.5T240-680v80q0 38-22 69t-58 44v14q36 13 58 44t22 69v80q0 17 11.5 28.5T280-240h120v80H280Z"
        />
      </symbol>

      <symbol
        id="node-foreground-4"
        viewBox="0 -960 960 960"
        fill={COLOR_BLACK}
      >
        {/* https://github.com/google/material-design-icons/blob/master/LICENSE */}
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M296-270q-42 35-87.5 32T129-269q-34-28-46.5-73.5T99-436l75-124q-25-22-39.5-53T120-680q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47q-9 0-18-1t-17-3l-77 130q-11 18-7 35.5t17 28.5q13 11 31 12.5t35-12.5l420-361q42-35 88-31.5t80 31.5q34 28 46 73.5T861-524l-75 124q25 22 39.5 53t14.5 67q0 66-47 113t-113 47q-66 0-113-47t-47-113q0-66 47-113t113-47q9 0 17.5 1t16.5 3l78-130q11-18 7-35.5T782-630q-13-11-31-12.5T716-630L296-270Zm-16-330q33 0 56.5-23.5T360-680q0-33-23.5-56.5T280-760q-33 0-56.5 23.5T200-680q0 33 23.5 56.5T280-600Zm400 400q33 0 56.5-23.5T760-280q0-33-23.5-56.5T680-360q-33 0-56.5 23.5T600-280q0 33 23.5 56.5T680-200ZM280-680Zm400 400Z"
        />
      </symbol>

      <symbol
        id="node-foreground-5"
        viewBox="0 -960 960 960"
        fill={COLOR_BLACK}
      >
        {/* https://github.com/google/material-design-icons/blob/master/LICENSE */}
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M200-120q-33 0-56.5-23.5T120-200v-400q0-100 70-170t170-70h240q100 0 170 70t70 170v400q0 33-23.5 56.5T760-120H200Zm0-80h560v-400q0-66-47-113t-113-47H360q-66 0-113 47t-47 113v400Zm160-280q-33 0-56.5-23.5T280-560q0-33 23.5-56.5T360-640q33 0 56.5 23.5T440-560q0 33-23.5 56.5T360-480Zm240 0q-33 0-56.5-23.5T520-560q0-33 23.5-56.5T600-640q33 0 56.5 23.5T680-560q0 33-23.5 56.5T600-480ZM280-200v-80q0-33 23.5-56.5T360-360h240q33 0 56.5 23.5T680-280v80h-80v-80h-80v80h-80v-80h-80v80h-80Zm-80 0h560-560Z"
        />
      </symbol>
    </defs>
  );
};
