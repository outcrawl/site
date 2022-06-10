import { CODE_FONT_FAMILY } from '../theme';
import {
  CODE_COMMAND_LINE_CLASS_NAME,
  CODE_LINE_HIGHLIGHT_CLASS_NAME,
} from './constants';
import { grey } from '@mui/material/colors';
import { Box, SxProps, SystemStyleObject, Theme } from '@mui/system';
import React, { HTMLAttributes } from 'react';

type MdxBlockCodeProps = {
  sx?: SxProps<Theme>;
} & HTMLAttributes<HTMLElement>;

const MdxBlockCode: React.FC<MdxBlockCodeProps> = ({
  sx = [],
  ...props
}: MdxBlockCodeProps) => (
  <Box
    sx={[
      {
        overflow: 'auto',
        margin: '1em 0',
        [`.${CODE_COMMAND_LINE_CLASS_NAME}`]: {
          display: 'block',
          float: 'left',
          padding: 0,
          margin: 0,
          pointerEvents: 'none',
          WebkitUserSelect: 'none',
          MozkitUserSelect: 'none',
          MskitUserSelect: 'none',
          userSelect: 'none',
        },
        [`.${CODE_COMMAND_LINE_CLASS_NAME} > span:before`]: {
          color: '#999',
          content: '" "',
          display: 'block',
          paddingRight: '1em',
        },
        [`.${CODE_COMMAND_LINE_CLASS_NAME} > span[data-prompt]:before`]: {
          content: '"$"',
        },
      },
      getCodeTheme(),
      ...((Array.isArray(sx) ? sx : [sx]) as SystemStyleObject<Theme>[]),
    ]}
  >
    <Box
      component="pre"
      sx={[
        {
          fontFamily: CODE_FONT_FAMILY,
          fontWeight: 400,
          fontSize: '0.875rem',
          lineHeight: '1.6em',
          margin: 0,
          overflow: 'initial',
          padding: '1em',
          minWidth: '100%',
          float: 'left',
          MozTabSize: 4,
          tabSize: 4,
          hyphens: 'none',
          WebkitHyphens: 'none',
          MozHyphens: 'none',
          MsHyphens: 'none',
          '& code': {
            backgroundColor: 'transparent',
            width: '100%',
            p: 0,
          },
          [`& .${CODE_LINE_HIGHLIGHT_CLASS_NAME}`]: {
            display: 'block',
            background: 'rgba(0, 0, 0, 0.08)',
            margin: '0 -1em',
            padding: '0 1em',
          },
        },
      ]}
      {...props}
    />
  </Box>
);

export default MdxBlockCode;

const visualStudioLight = {
  background: grey['100'],
  foreground: grey['900'],
  comment: '#008016',
  string: '#E11500',
  function: '#785318',
  classMame: '#0491C1',
  keyword: '#3200FF',
  preprocessorProperty: '#80807F',
  atrule: '#3200FF',
  cssForeground: '#3200FF',
  cssSelector: '#B80000',
  cssProperty: '#B80000',
  doctype: '#0491C1',
  markupTag: '#B80000',
  attrName: '#FF0000',
  markupPunctuation: '#3200FF',
  markupAttrValue: '#3200FF',
};
// const visualStudioDark = {
//   background: '#1E1E1E',
//   foreground: '#DCDCDA',
//   comment: '#23A658',
//   string: '#EA9D78',
//   function: '#A0D7A7',
//   classMame: '#13C9C6',
//   keyword: '#439CE2',
//   preprocessorProperty: '#9B9B99',
//   atrule: '#439CE2',
//   cssForeground: '#C8C8C6',
//   cssSelector: '#D8BA76',
//   cssProperty: '#67DCFF',
//   doctype: '#13C9C6',
//   markupTag: '#439CE2',
//   attrName: '#87DCFF',
//   markupPunctuation: '#80807F',
//   markupAttrValue: '#C8C8C6',
// };

function getCodeTheme(colors = visualStudioLight): SystemStyleObject<Theme> {
  return {
    background: colors.background,
    color: colors.foreground,
    '.token': {
      '&.punctuation': {
        color: colors.foreground,
      },

      '&.comment': {
        color: colors.comment,
      },

      '&.string': {
        color: colors.string,
      },

      '&.function': {
        color: colors.function,
      },

      '&.class-name': {
        color: colors.classMame,
      },

      '&.doctype, &.prolog': {
        color: colors.doctype,
      },

      '&.keyword': {
        color: colors.keyword,
      },

      '&.preprocessor.property': {
        color: colors.preprocessorProperty,

        '&.keyword': {
          color: colors.preprocessorProperty,
        },
      },

      '&.selector': {
        color: colors.cssSelector,
      },

      '&.atrule': {
        color: colors.atrule,
      },

      '&.tag': {
        color: colors.markupTag,
      },

      '&.attr-name': {
        color: colors.attrName,
      },

      '&.attr-value': {
        color: colors.markupAttrValue,
      },
    },
    // CSS
    'code[class*="language-css"]': {
      color: colors.cssForeground,

      '.token': {
        '&.property': {
          color: colors.cssProperty,
        },

        '&.string': {
          color: colors.cssForeground,
        },
      },
    },
    // Markup
    'code[class*="language-markup"]': {
      '.token': {
        '&.punctuation': {
          color: colors.markupPunctuation,
        },
      },
    },
  };
}
