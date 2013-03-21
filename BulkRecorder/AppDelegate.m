//
//  AppDelegate.m
//  BulkRecorder
//
//  Created by Hongli Lai on 3/20/2013.
//  Copyright (c) 2013 Phusion. All rights reserved.
//

#import "AppDelegate.h"
#include <sys/types.h>
#include <pwd.h>
#include <unistd.h>

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification
{
    NSMutableDictionary *format = [[NSMutableDictionary alloc] initWithDictionary:[UKSoundFileRecorder defaultOutputFormat]];
    [format setObject:UKAudioOutputFileTypeM4A forKey:UKAudioOutputFileType];
    
    state = WAITING_FOR_RECORD;
    recorder = [[UKSoundFileRecorder alloc] init];
    [recorder setOutputFormat:format];
    
    struct passwd *passwd = getpwuid(getuid());
    NSMutableString *url = [[NSMutableString alloc] initWithString:@"file://localhost"];
    [url appendString:[[NSString alloc] initWithUTF8String:passwd->pw_dir]];
    [self.savePathControl setURL: [[NSURL alloc] initWithString:url]];
    
    [self.savePathControl setDelegate:self];
    [self.nameField setDelegate:self];
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)theApplication {
    return YES;
}

- (IBAction)nameFieldActivated:(id)sender {
    if (state == WAITING_FOR_RECORD) {
        [self.recordButton performClick:sender];
    } else if (state == RECORDING) {
        [self.stopButton performClick:sender];
    }
}

- (IBAction)recordButtonClicked:(id)sender {
    state = RECORDING;
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
    state = STOPPING_RECORDING;
    [recorder stop:self];
    // Causes nameFieldActivated: to be called.
    [self.nameField selectText:self];
    [self.recordButton setEnabled:TRUE];
    [self.stopButton setEnabled:FALSE];
    state = WAITING_FOR_RECORD;
}

- (void)controlTextDidChange:(NSNotification *)aNotification {
    BOOL enabled = [[self.nameField stringValue] length] > 0;
    [self.recordButton setEnabled:enabled];
}

- (void)pathControl:(NSPathControl *)pathControl willDisplayOpenPanel:(NSOpenPanel *)openPanel {
    [openPanel setCanCreateDirectories:YES];
}

@end
