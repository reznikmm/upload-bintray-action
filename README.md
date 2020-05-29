# Upload to the Bintray action

This action uploads files to the [BinTray](https://bintray.com/) site.

## Inputs
### repository
**Required** Bintray repository name"

### package
**Required** Bintray package name"

### version
**Required** Binary version number"
### sourcePath
**Required** Path to source binary to upload"

### username
**Required** Bintray username"

### apiKey
**Required** Bintray API Key"

### override
**Required** To override an already-published artifact you need to set this to 1"

## Example usage
```
      - uses: reznikmm/upload-bintray-action@v1
        with:
          username: reznikmm
          repository: libadalang
          package: libadalang
          version: 0.1-git
          sourcePath: '*.tar.gz'
          override: 1
          apiKey: ${{secrets.BINTRAY_API_KEY}}
```
