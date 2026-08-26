export interface BanditLevel {
  level: number;
  title: string;
  objective: string;
  loginUser: string;
  nextUser: string;
  hint: string;
  flagSolution: string;
  solutionCommand: string;
  simulatedFiles: Record<string, string>;
  explanation: string;
}

export const BANDIT_LEVELS_DATA: BanditLevel[] = [
  {
    level: 0,
    title: 'Bandit Level 0 -> Level 1',
    objective: 'The password for the next level is stored in a file called readme located in the home directory.',
    loginUser: 'bandit0',
    nextUser: 'bandit1',
    hint: 'Use the `cat` command to view the contents of the readme file.',
    flagSolution: 'NH2SXmwwYerAyeZ3ZngHda6Aq9tKtBxN',
    solutionCommand: 'cat readme',
    simulatedFiles: {
      'readme': 'NH2SXmwwYerAyeZ3ZngHda6Aq9tKtBxN'
    },
    explanation: 'The `cat` utility concatenates files and prints their standard output to the terminal.'
  },
  {
    level: 1,
    title: 'Bandit Level 1 -> Level 2',
    objective: 'The password for the next level is stored in a file called - located in the home directory.',
    loginUser: 'bandit1',
    nextUser: 'bandit2',
    hint: 'A dashed filename `-` is interpreted as standard input by many commands. Reference it using a relative path `./-` or `cat < -`.',
    flagSolution: 'rRGizSaX8Mk1RTb1CNQoXTcYZWU6lgzi',
    solutionCommand: 'cat ./-',
    simulatedFiles: {
      '-': 'rRGizSaX8Mk1RTb1CNQoXTcYZWU6lgzi'
    },
    explanation: 'Prepend `./` to avoid option parser confusion when file names start with hyphens or dashes.'
  },
  {
    level: 2,
    title: 'Bandit Level 2 -> Level 3',
    objective: 'The password for the next level is stored in a file called "spaces in this filename" located in the home directory.',
    loginUser: 'bandit2',
    nextUser: 'bandit3',
    hint: 'Wrap filenames containing spaces in quotes: `cat "spaces in this filename"` or use backslash escaping `cat spaces\\ in\\ this\\ filename`.',
    flagSolution: 'aBZ0W5EmUfAf7kHTQal8AjWkg11svQI1',
    solutionCommand: 'cat "spaces in this filename"',
    simulatedFiles: {
      'spaces in this filename': 'aBZ0W5EmUfAf7kHTQal8AjWkg11svQI1'
    },
    explanation: 'Shells split arguments by whitespace unless escaped or enclosed in quotation marks.'
  },
  {
    level: 3,
    title: 'Bandit Level 3 -> Level 4',
    objective: 'The password for the next level is stored in a hidden file inside the directory "inhere".',
    loginUser: 'bandit3',
    nextUser: 'bandit4',
    hint: 'Hidden files in Linux begin with a dot `.`. Use `ls -la inhere` or `cd inhere && ls -a`.',
    flagSolution: '2EW7BBsr6aKdqiCWm1wMgHGpwFailureFlag',
    solutionCommand: 'cat inhere/.hidden',
    simulatedFiles: {
      'inhere/.hidden': '2EW7BBsr6aKdqiCWm1wMgHGpwFailureFlag'
    },
    explanation: 'The `-a` flag instructs `ls` to list all entries starting with `.` (hidden files and directories).'
  },
  {
    level: 4,
    title: 'Bandit Level 4 -> Level 5',
    objective: 'The password for the next level is stored in the only human-readable file in the inhere directory.',
    loginUser: 'bandit4',
    nextUser: 'bandit5',
    hint: 'Use the `file` command: `file inhere/*` to distinguish ASCII text from binary data.',
    flagSolution: 'lrIWWI6bB37kxfiCQZqUdOIYfr6eEeqR',
    solutionCommand: 'cat inhere/-file07',
    simulatedFiles: {
      'inhere/-file01': 'PNG\r\n\x1a\n\x00\x00\x00\rIHDR',
      'inhere/-file02': '\x7fELF\x02\x01\x01\x00\x00\x00\x00',
      'inhere/-file07': 'lrIWWI6bB37kxfiCQZqUdOIYfr6eEeqR'
    },
    explanation: 'The `file` command examines file headers and magic bytes to determine mime/encoding types.'
  },
  {
    level: 5,
    title: 'Bandit Level 5 -> Level 6',
    objective: 'The password for the next level is stored in a file somewhere under inhere that is: 1033 bytes in size, not executable, and human-readable.',
    loginUser: 'bandit5',
    nextUser: 'bandit6',
    hint: 'Use `find inhere -size 1033c ! -executable`.',
    flagSolution: 'P4L4vucdmLnm8I61n02RGeYrNuE00Qsp',
    solutionCommand: 'find inhere -size 1033c -exec cat {} +',
    simulatedFiles: {
      'inhere/maybehere07/.file2': 'P4L4vucdmLnm8I61n02RGeYrNuE00Qsp'
    },
    explanation: 'The `find` utility allows precision filtering by file size (`-size`), permissions (`-perm`), and types.'
  },
  {
    level: 6,
    title: 'Bandit Level 6 -> Level 7',
    objective: 'The password is in a file owned by user bandit7, owned by group bandit6, and exactly 33 bytes in size.',
    loginUser: 'bandit6',
    nextUser: 'bandit7',
    hint: 'Use `find / -user bandit7 -group bandit6 -size 33c 2>/dev/null`.',
    flagSolution: 'z7WtoNQU2XfjmMtWA8u5rN4vzqu4v99S',
    solutionCommand: 'cat /var/lib/bandit7/password.txt',
    simulatedFiles: {
      'var/lib/bandit7/password.txt': 'z7WtoNQU2XfjmMtWA8u5rN4vzqu4v99S'
    },
    explanation: 'Redirecting stderr with `2>/dev/null` silences permission denied warnings during system-wide searches.'
  },
  {
    level: 7,
    title: 'Bandit Level 7 -> Level 8',
    objective: 'The password for the next level is stored in the file data.txt next to the word "millionth".',
    loginUser: 'bandit7',
    nextUser: 'bandit8',
    hint: 'Use `grep "millionth" data.txt` or `awk \'/millionth/ {print $2}\' data.txt`.',
    flagSolution: 'TESKZC0XvTetK0S9xNwm25STFBFtstEc',
    solutionCommand: 'grep "millionth" data.txt',
    simulatedFiles: {
      'data.txt': 'first_word\tabc123\nmillionth\tTESKZC0XvTetK0S9xNwm25STFBFtstEc\nlast_word\txyz789'
    },
    explanation: 'The `grep` command searches text files for regex pattern matches and prints matching lines.'
  },
  {
    level: 8,
    title: 'Bandit Level 8 -> Level 9',
    objective: 'The password for the next level is stored in data.txt and is the only line of text that occurs exactly once.',
    loginUser: 'bandit8',
    nextUser: 'bandit9',
    hint: 'Sort the file first before counting uniqueness: `sort data.txt | uniq -u`.',
    flagSolution: 'EN632PlfYi2nTXc77wDNnrqSmqDm舗s8w',
    solutionCommand: 'sort data.txt | uniq -u',
    simulatedFiles: {
      'data.txt': 'duplicate_line\nduplicate_line\nEN632PlfYi2nTXc77wDNnrqSmqDm舗s8w\nduplicate_line'
    },
    explanation: '`uniq` only suppresses adjacent duplicate lines; piping `sort` into `uniq -u` isolates unique lines.'
  },
  {
    level: 9,
    title: 'Bandit Level 9 -> Level 10',
    objective: 'The password for the next level is stored in the file data.txt in one of the few human-readable strings, preceded by several \'=\' characters.',
    loginUser: 'bandit9',
    nextUser: 'bandit10',
    hint: 'Extract strings from binary data with `strings data.txt | grep "==="`.',
    flagSolution: 'G7w8LIi6J3WaQIYxA6rxUZHG7ctkYsSc',
    solutionCommand: 'strings data.txt | grep "==="',
    simulatedFiles: {
      'data.txt': '\x00\x01\x02=== the password is G7w8LIi6J3WaQIYxA6rxUZHG7ctkYsSc ===\x00\xff'
    },
    explanation: 'The `strings` utility finds and prints sequences of printable characters at least 4 characters long in arbitrary binary files.'
  }
];
