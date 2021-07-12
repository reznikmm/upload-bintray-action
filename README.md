# Upload to the Bintray action

This action uploads files to the [BinTray](https://bintray.com/) site.

## Inputs
### subject
**Required** Bintray subject (repository owner). Default `"subject"`.

### repository
**Required** Bintray repository name. Default `"repo"`.

### package
**Required** Bintray package name. Default `"package"`.

### version
**Required** Binary version number. Default `"version"`. The action will
try to create this version before uploading.

### versionDesc
**Optional** Version description on Bintray. Default `"Version: ${version}"`.

### sourcePath
**Required** Path to source binary to upload. Default `"*.tar.gz"`.

### destinationPath
**Optional** Destination path on Bintray. Default `""`.

### username
**Required** Bintray username to authenticate. Default `"username"`.

### apiKey
**Required** Bintray API Key. Default `"secret"`. Won't upload if it's empty.

### override
**Required** To override an already-published artifact you need to set this to 1. Default `"0"`.

### showInDownloads
**Optional** Show the file in the Download List; to enable set this to 1. Default `"0"`.

## Example usage
```
      - uses: reznikmm/upload-bintray-action@v4
        with:
          subject: reznikmm
          repository: libadalang
          package: libadalang
          version: 0.1-git
          sourcePath: '*.tar.gz'
          override: 1
          showInDownloads: 1
          username: reznikmm
          apiKey: ${{secrets.BINTRAY_API_KEY}}
```
