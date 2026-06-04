import time
import tkinter as tk

class Stopwatch(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Stopwatch")
        self.elapsed_ms = 0
        self.running = False
        self.last_update = None

        self.time_label = tk.Label(self, text="00:00:00.000", font=("Helvetica", 24), width=15)
        self.time_label.pack(padx=16, pady=(16, 8))

        buttons_frame = tk.Frame(self)
        buttons_frame.pack(pady=(0, 16))

        self.start_button = tk.Button(buttons_frame, text="Start", width=10, command=self.start)
        self.stop_button = tk.Button(buttons_frame, text="Stop", width=10, command=self.stop)
        self.reset_button = tk.Button(buttons_frame, text="Reset", width=10, command=self.reset)

        self.start_button.grid(row=0, column=0, padx=5)
        self.stop_button.grid(row=0, column=1, padx=5)
        self.reset_button.grid(row=0, column=2, padx=5)

        self.update_display()

    def start(self):
        if not self.running:
            self.running = True
            self.last_update = time.time()

    def stop(self):
        if self.running:
            self.running = False

    def reset(self):
        self.running = False
        self.elapsed_ms = 0
        self.time_label.config(text="00:00:00.000")

    def format_time(self, ms):
        hours = ms // 3600000
        remainder = ms % 3600000
        minutes = remainder // 60000
        remainder %= 60000
        seconds = remainder // 1000
        milliseconds = remainder % 1000
        return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

    def update_display(self):
        if self.running:
            now = time.time()
            delta = int((now - self.last_update) * 1000)
            self.elapsed_ms += delta
            self.last_update = now

        self.time_label.config(text=self.format_time(self.elapsed_ms))
        self.after(50, self.update_display)


if __name__ == "__main__":
    app = Stopwatch()
    app.mainloop()


    
