/*
 * Copyright (C) 2012 GREE, Inc.
 * 
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

using System;
using System.Collections;
using UnityEngine;
#if UNITY_2018_4_OR_NEWER
using UnityEngine.Networking;
#endif
using UnityEngine.UI;
using System.Collections.Generic;
using System.Linq;
using Configurations;

public enum IncomingMessageAction
{
    Initialize,
}

public struct IncomingMessage
{
    public string action;
    public string payload;
}

public class SampleWebView : MonoBehaviour
{
    public string Url;
    public ConfigurationsController configurationsController;

    WebViewObject webViewObject;

    IEnumerator Start()
    {
        BetterStreamingAssets.Initialize();
        webViewObject = (new GameObject("WebViewObject")).AddComponent<WebViewObject>();
        webViewObject.Init(
            cb: (msg) =>
            {
                Debug.Log(string.Format("CallFromJS[{0}]", msg));
                HandleIncomingMessage(msg);
            },
            err: (msg) =>
            {
                Debug.Log(string.Format("CallOnError[{0}]", msg));
            },
            started: (msg) =>
            {
                Debug.Log(string.Format("CallOnStarted[{0}]", msg));
            },
            hooked: (msg) =>
            {
                Debug.Log(string.Format("CallOnHooked[{0}]", msg));
            },
            ld: (msg) =>
            {
                Debug.Log(string.Format("CallOnLoaded[{0}]", msg));
#if UNITY_EDITOR_OSX || (!UNITY_ANDROID && !UNITY_WEBPLAYER && !UNITY_WEBGL)
                // NOTE: depending on the situation, you might prefer
                // the 'iframe' approach.
                // cf. https://github.com/gree/unity-webview/issues/189
#if true
                webViewObject.EvaluateJS(@"
                  if (window && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.unityControl) {
                    window.Unity = {
                      call: function(msg) {
                        window.webkit.messageHandlers.unityControl.postMessage(msg);
                      }
                    }
                  } else {
                    window.Unity = {
                      call: function(msg) {
                        window.location = 'unity:' + msg;
                      }
                    }
                  }
                ");
#else
                webViewObject.EvaluateJS(@"
                  if (window && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.unityControl) {
                    window.Unity = {
                      call: function(msg) {
                        window.webkit.messageHandlers.unityControl.postMessage(msg);
                      }
                    }
                  } else {
                    window.Unity = {
                      call: function(msg) {
                        var iframe = document.createElement('IFRAME');
                        iframe.setAttribute('src', 'unity:' + msg);
                        document.documentElement.appendChild(iframe);
                        iframe.parentNode.removeChild(iframe);
                        iframe = null;
                      }
                    }
                  }
                ");
#endif
#elif UNITY_WEBPLAYER || UNITY_WEBGL
                webViewObject.EvaluateJS(
                    "window.Unity = {" +
                    "   call:function(msg) {" +
                    "       parent.unityWebView.sendMessage('WebViewObject', msg)" +
                    "   }" +
                    "};");
#endif
                webViewObject.EvaluateJS(@"Unity.call('ua=' + navigator.userAgent)");
            },
            //transparent: false,
            //zoom: true,
            //ua: "custom user agent string",
#if UNITY_EDITOR
            separated: false,
#endif
            enableWKWebView: true,
            wkContentMode: 0);  // 0: recommended, 1: mobile, 2: desktop
#if UNITY_EDITOR_OSX || UNITY_STANDALONE_OSX
        webViewObject.bitmapRefreshCycle = 1;
#endif
        // cf. https://github.com/gree/unity-webview/pull/512
        // Added alertDialogEnabled flag to enable/disable alert/confirm/prompt dialogs. by KojiNakamaru · Pull Request #512 · gree/unity-webview
        //webViewObject.SetAlertDialogEnabled(false);

        // cf. https://github.com/gree/unity-webview/pull/550
        // introduced SetURLPattern(..., hookPattern). by KojiNakamaru · Pull Request #550 · gree/unity-webview
        //webViewObject.SetURLPattern("", "^https://.*youtube.com", "^https://.*google.com");

        // cf. https://github.com/gree/unity-webview/pull/570
        // Add BASIC authentication feature (Android and iOS with WKWebView only) by takeh1k0 · Pull Request #570 · gree/unity-webview
        //webViewObject.SetBasicAuthInfo("id", "password");

        // webViewObject.SetMargins(5, 100, 5, Screen.height / 4);
        webViewObject.SetVisibility(true);


        //HandleIncomingMessage("{\"action\": \"Initialize\", \"payload\": \"{\\\"name\\\": \\\"afonso\\\", \\\"player\\\": \\\"maduro\\\"}\"}");

#if UNITY_IPHONE || UNITY_STANDALONE_OSX
        webViewObject.SetScrollBounceEnabled(false);
#endif

#if !UNITY_WEBPLAYER && !UNITY_WEBGL
        if (Url.StartsWith("http"))
        {
            webViewObject.LoadURL(Url.Replace(" ", "%20"));
        }
        else
        {

            //var sourcePath = System.IO.Path.Combine(Application.streamingAssetsPath, Url);
            var sourceBasePath = Application.streamingAssetsPath;
            //var sourceBasePath = "jar:file:/" + Application.dataPath + "!/assets/";
            var destinationPath = Application.persistentDataPath;
            var index = System.IO.Path.Combine(destinationPath, "index.html");
            string[] files = BetterStreamingAssets.GetFiles(System.IO.Path.Combine(Url == "" ? "/" : Url), "*", System.IO.SearchOption.AllDirectories);
            //string[] directories = System.IO.Directory.GetDirectories(sourcePath);
            string[] directories = GetPathArrayDirectories(files);

            foreach (string dirPath in directories)
            {
                System.IO.Directory.CreateDirectory(System.IO.Path.Combine(destinationPath, dirPath));
            }

            foreach (string newPath in files)
            {
                string fromPath = System.IO.Path.Combine(sourceBasePath, newPath);
                string toPath = System.IO.Path.Combine(destinationPath, newPath);

                if (fromPath.Contains("://"))
                {
                    // Android
                    UnityWebRequest unityWebRequest = UnityWebRequest.Get(fromPath);
                    yield return unityWebRequest.SendWebRequest();
                    byte[] result = unityWebRequest.downloadHandler.data;
                    System.IO.File.WriteAllBytes(toPath, result);
                }
                else
                {
                    System.IO.File.Copy(fromPath, toPath, true);
                }
            }

            webViewObject.LoadURL("file://" + index);
        }
#else
        if (Url.StartsWith("http"))
        {
            webViewObject.LoadURL(Url.Replace(" ", "%20"));
        }
        else
        {
            webViewObject.LoadURL("StreamingAssets/" + Url + "index.html");
        }
#endif
        yield break;
    }

    void HandleIncomingMessage(string payload)
    {
        IncomingMessage message = JsonUtility.FromJson<IncomingMessage>(payload);

        switch (Enum.Parse(typeof(IncomingMessageAction), message.action))
        {
            case IncomingMessageAction.Initialize:
                Configuration configuration = JsonUtility.FromJson<Configuration>(message.payload);
                Debug.Log("Initialize with: " + configuration.name + " - " + configuration.player);
                configurationsController.Initialize(configuration);
                DestroyImmediate(this.webViewObject.gameObject);
                LayoutGroup canvas = GameObject.Find("Canvas").GetComponent<LayoutGroup>();
                LayoutRebuilder.ForceRebuildLayoutImmediate(canvas.GetComponent<RectTransform>());

                //foreach (var layoutGroup in canvas.GetComponentsInChildren<LayoutGroup>())
                //{
                //    LayoutRebuilder.ForceRebuildLayoutImmediate(layoutGroup.GetComponent<RectTransform>());
                //}
                break;
            default:
                break;
        }
    }

    void AppendPathDirectories(HashSet<string> directories, string path)
    {
        string directory = System.IO.Path.GetDirectoryName(path);

        if (directory == "")
        {
            return;
        }
        else
        {
            directories.Add(directory);
            AppendPathDirectories(directories, directory);
        }
    }

    string[] GetPathArrayDirectories(string[] paths)
    {
        HashSet<string> directories = new HashSet<string>();

        foreach (string path in paths)
        {
            AppendPathDirectories(directories, path);
        }
        return directories.ToArray();
    }
}
