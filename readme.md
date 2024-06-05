## warp

### Usage

```yaml
- name: Setup WARP
  uses: boywithkeyboard/warp@v1
  with:
    familyMode: malware
```

### Options

| Name | Description | Allowed Values | Default Value |
| :--- | :--- | :--- | :--- |
| `onlyDoH` | Use only DNS over HTTPS. | `true` / `false` | `false` |
| `familyMode` | Block malware and/or NSFW content. | `off` / `malware` / `on` | `off` |
