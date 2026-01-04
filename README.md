# mcbe-structure-extract

A simple CLI tool to extract `.mcstructure` files from **Minecraft Bedrock Edition** worlds
directly from **LevelDB**.

Works with:
- `.mcworld` files (compressed)
- Bedrock world folders (containing `level.dat` and `db/`)

Supports **Android / Termux**, Linux, macOS, and Windows.

---

## Features

- Extract `.mcstructure` directly from Bedrock LevelDB
- Output organized by namespace
- Works without Amulet or native LevelDB bindings
- CLI-friendly and scriptable
- Global install via npm

---

## Installation

### Global install (recommended)

```bash
npm install -g mcbe-structure-extract
```

---

## Usage

```bash
mcbe-structure-extract <input> [--output <dir>]
```

### Arguments

**input (required)**  
Path to:
- a `.mcworld` file  
- OR a Bedrock world folder containing:
  - level.dat
  - levelname.txt
  - db/

**--output <dir> (optional)**  
Base output directory.

If omitted, output will be created in the current directory.

---

## Output Structure

Structures are saved under a `structures/` folder, organized by namespace.

Example:

```
structures/
├── minecraft/
│   └── village_house.mcstructure
├── mystructure/
│   └── house.mcstructure
└── custom/
    └── loader_v2.mcstructure
```

---

## Examples

### Extract from `.mcworld`

```bash
mcbe-structure-extract world.mcworld
```

Output:

```
./structures/
```

---

### Extract from world folder

```bash
mcbe-structure-extract /sdcard/worlds/MyWorld
```

---

### Custom output directory

```bash
mcbe-structure-extract world.mcworld --output /sdcard/export
```

Output:

```
/sdcard/export/structures/
```

---

## How It Works

This tool:
1. Reads Bedrock LevelDB data using `mcbe-leveldb-reader`
2. Detects structure entries using the `structuretemplate_` key prefix
3. Extracts raw structure bytes
4. Writes valid `.mcstructure` files

---

## Notes

- This tool only extracts saved structures (via `/structure save` or Structure Block)
- It does not extract arbitrary builds from chunks

---

## License

MIT License
