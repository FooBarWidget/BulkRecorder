//
//  AppDelegate.m
//  BulkRecorder
//
//  Created by Hongli Lai on 3/20/2013.
//  Copyright (c) 2013 Phusion. All rights reserved.
//

#import "AppDelegate.h"

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification
{
    // Insert code here to initialize your application
    recorder = [[UKSoundFileRecorder alloc] init];
    NSMutableDictionary *format = [[NSMutableDictionary alloc] initWithDictionary:[UKSoundFileRecorder defaultOutputFormat]];
    [format setObject:UKAudioOutputFileTypeM4A forKey:UKAudioOutputFileType];
    [recorder setOutputFormat:format];
    [self.nameField setDelegate:self];
}

- (IBAction)recordButtonClicked:(id)sender {
    if (![self.recordButton isEnabled]) {
        return;
    }
    NSMutableString *filename = [[NSMutableString alloc] init];
    [filename appendString:@"/Users/hongli/"];
    [filename appendString:[self.nameField stringValue]];
    [filename appendString:@".m4a"];
    unlink([filename cStringUsingEncoding:NSUTF8StringEncoding]);
    [recorder setOutputFilePath:filename];
    [recorder start:self];
    [self.recordButton setEnabled:FALSE];
    [self.stopButton setEnabled:TRUE];
}

- (IBAction)stopButtonClicked:(id)sender {
    [recorder stop:self];
    [self.recordButton setEnabled:TRUE];
    [self.stopButton setEnabled:FALSE];
    [self.nameField selectText:self];
}

- (void)controlTextDidChange:(NSNotification *)aNotification {
    BOOL enabled = [[self.nameField stringValue] length] > 0;
    [self.recordButton setEnabled:enabled];
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)theApplication {
    return YES;
}

@end
