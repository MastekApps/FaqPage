try
{
	$configFormat = @"
(function(){{
	"use strict";
	window.faq_is_debug = {0};
	window.faq_version = '{1}';
}})();
"@

	$projectPath = $args[0]
	$isDebugString = $args[1]
	$xdoc = [xml] (Get-Content "$($projectPath)AppManifest.xml")
	write "Updating build config with $($xdoc.App.Version) version"
	$buildConfig = [System.String]::Format($configFormat, $isDebugString, $xdoc.App.Version)
	Set-Content "$($projectPath)Scripts\build\build_config.js" $buildConfig
	
	exit 0
}
catch [Exception]
{
	$msg = [System.String]::Format("Exception! Message: {0}, StackTrace: {1}", $_.Exception.Message, $_.Exception.StackTrace)
	write $msg
	
	exit 1
}