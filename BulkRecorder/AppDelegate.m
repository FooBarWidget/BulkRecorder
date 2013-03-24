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
    NSOpenPanel *openPanel = [[NSOpenPanel alloc] init];
    [openPanel setCanCreateDirectories:YES];
    [openPanel setCanChooseFiles:NO];
    [openPanel setCanChooseDirectories:YES];
    [openPanel setTitle:@"Choose a location to save files to"];
    if ([openPanel runModal] == NSFileHandlingPanelCancelButton) {
        [NSApp terminate:nil];
    }
    
    NSMutableDictionary *format = [[NSMutableDictionary alloc] initWithDictionary:[UKSoundFileRecorder defaultOutputFormat]];
    [format setObject:UKAudioOutputFileTypeM4A forKey:UKAudioOutputFileType];
    
    state = WAITING_FOR_RECORD;
    recorder = [[UKSoundFileRecorder alloc] init];
    [recorder setOutputFormat:format];
    
    [self.savePathControl setURL:[openPanel URL]];
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
    
    NSString *dir = [[self.savePathControl URL] path];
    NSMutableString *filename = [[NSMutableString alloc] initWithString:dir];
    [filename appendString:@"/"];
    [filename appendString:[self.nameField stringValue]];
    [filename appendString:@".aac"];
    
    unlink([filename cStringUsingEncoding:NSUTF8StringEncoding]);
    [recorder setOutputFilePath:filename];
    [recorder start:self];
    
    [self.nameField setEditable:FALSE];
    [self.recordButton setEnabled:FALSE];
    [self.stopButton setEnabled:TRUE];
}

- (IBAction)stopButtonClicked:(id)sender {
    state = STOPPING_RECORDING;
    [recorder stop:self];
    [self.nameField setEditable:TRUE];
    // Causes nameFieldActivated: to be called.]
    [self.nameField selectText:self];
    [self.recordButton setEnabled:TRUE];
    [self.stopButton setEnabled:FALSE];
    state = WAITING_FOR_RECORD;
}

static BOOL validateName(const NSString *name) {
    NSUInteger i, len = [name length];
    for (i = 0; i < len; i++) {
        unichar ch = [name characterAtIndex:i];
        BOOL ok = (ch >= 'a' && ch <= 'z')
         || (ch >= 'A' && ch <= 'Z')
         || (ch >= '0' && ch <= '9')
         || ch == ' ' || ch == '?' || ch == ',';
        if (!ok) {
            return NO;
        }
    }
    return YES;
}

- (void)controlTextDidChange:(NSNotification *)aNotification {
    NSString *name = [self.nameField stringValue];
    BOOL enabled = [name length] > 0 && validateName(name);
    [self.recordButton setEnabled:enabled];
}

- (BOOL)control:(NSControl *)control textView:(NSTextView *)fieldEditor doCommandBySelector:(SEL)commandSelector
{
    if (commandSelector == @selector(insertNewline:)) {
        [self nameFieldActivated:self];
        return YES;
    } else {
        return NO;
    }
}

- (void)pathControl:(NSPathControl *)pathControl willDisplayOpenPanel:(NSOpenPanel *)openPanel {
    [openPanel setCanCreateDirectories:YES];
    [openPanel setCanChooseDirectories:YES];
    [openPanel setCanChooseFiles:NO];
}

@end
