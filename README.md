# SnapLogic Pipeline Linker

A simple Google Chrome Extension for the SnapLogic Designer that copies the direct link of the active Pipeline to your clipboard:

![recording](https://dl.dropboxusercontent.com/u/3519578/Screenshots/pipeline-linker-recording.gif)

When installed, this Chrome Extension will initially be grayed out and disabled:

![installed](https://dl.dropboxusercontent.com/u/3519578/Screenshots/NNhY.png)

It will only be enabled if it detects the active tab is the SnapLogic Designer (in any Pod - Elastic, UAT, Canary etc.):

![enabled](https://dl.dropboxusercontent.com/u/3519578/Screenshots/X4su.png)

Then, when you wish to share the direct link to the currently active pipeline in Designer, just click the extension's icon beside the Chrome address bar (see above) or use the keyboard shortcut (default is Ctrl+i. Mac users, it is control+i, not command ⌘).

When triggered, you should see a Chrome Notification indicating that the Pipeline Link was copied to your clipboard:

![notification](https://dl.dropboxusercontent.com/u/3519578/Screenshots/vtlv.png)

The notification message is the name of the Pipeline, and the smaller contextual message below is the location of the pipeline and the Org name in parentheses.

In your clipboard, a link like the following will be present and ready to be shared:

![slack](https://dl.dropboxusercontent.com/u/3519578/Screenshots/MMps.png)

## Deploying

Build the ZIP file for the Google Web Store Developer Dashboard like so:

`zip -r <zip-name> <pipeline-linker-folder-location> -x <exclusions>`

e.g.

`zip -r pipeline-linker.zip pipeline-linker -x *.git* -x *.iml -x *.DS_Store`
